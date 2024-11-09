// Global imports
import { Router, Request, Response } from 'express';

// Scoped imports
import { createAllApplets, createAllServices } from '../creator';
import { OutputResult, ServiceReaction } from '../../types/service_reaction';
import { pool } from '../../utils/db';
import { Applet, Applets } from '../../types/applet';
import { Service } from '../../types/service';
import { ActionData, ActionResult } from '../../types/action_data';

const routes: Router = Router();
const nonces: string[] = [];

routes.post('/api/webhook/:service_name/:action_name', async (request: Request, response: Response) => {
  const { service_name, action_name } = request.params;

  const services = await createAllServices();

  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!services.hasOwnProperty(service_name)) {
    return response.status(404).json({ message: 'Service not found' });
  }

  const service = services[service_name];

  if (!service.actions.hasOwnProperty(action_name)) {
    return response.status(404).json({ message: 'Action not found' });
  }

  const action = service.actions[action_name];

  if (!service || !action) {
    return response.status(404).json({ message: 'Service and/or action not found' });
  }

  let client;

  try {
    client = await pool.connect();

    const parsed: ActionResult | undefined = await action.onWebhook(request, response);

    if (!parsed) {
      return response.json({ message: 'Event ignored because user is not found' });
    }

    if (parsed.is_response_ended) {
      return response;
    }

    if (parsed.nonce) {
      if (nonces.includes(parsed.nonce)) {
        return response.json({ message: 'Event ignored because nonce is already used' });
      }

      nonces.push(parsed.nonce);
    }

    if (!parsed.provided_user_id) {
      return response.json({ message: 'Event ignored because user is not found' });
    }

    const internalUser = await client.query(
      `SELECT users.id FROM users
      JOIN user_providers ON users.id = user_providers.user_id
      JOIN providers ON user_providers.provider_id = providers.id
      WHERE providers.account_id = $1 AND providers.account_name = $2`,
      [parsed.provided_user_id, service_name]
    );

    if (internalUser.rowCount === 0) {
      return response.json({ message: 'Event ignored because user is not found' });
    }

    const providedUser = await client.query('SELECT * FROM providers WHERE account_id = $1 AND account_name = $2', [
      parsed.provided_user_id,
      service_name,
    ]);

    if (providedUser.rowCount === 0) {
      return response.json({ message: 'Event ignored because user is not found' });
    }

    const data: ActionData = {
      user: {
        id: internalUser.rows[0].id,
      },
      provided_user: {
        id: providedUser.rows[0].account_id,
        email: providedUser.rows[0].account_email,
        token: providedUser.rows[0].account_token,
      },
      input: parsed.input,
    };

    const applets: Applets | undefined = await createAllApplets(data.user.id);

    if (!applets) {
      return;
    }

    let selectedApplets = await client.query('SELECT * FROM applets WHERE user_id = $1', [data.user.id]);
    let selectedCustomApplets = await client.query('SELECT * FROM custom_applets WHERE user_id = $1', [data.user.id]);

    let mergedApplets = [...selectedApplets.rows, ...selectedCustomApplets.rows];

    await Promise.all(
      mergedApplets.map(async (selectedApplet: { name: string; is_enabled: boolean; config: { [key: string]: string } }) => {
        if (!(selectedApplet.name in applets)) {
          return;
        }

        const applet: Applet | undefined = applets[selectedApplet.name];

        if (!applet) {
          return;
        }

        if (applet.action.serviceName != service_name || applet.action.name != action_name) {
          return;
        }

        if (!(applet.reaction.serviceName in services)) {
          return;
        }

        const reactionService = services[applet.reaction.serviceName];

        if (!reactionService) {
          return;
        }

        const reaction: ServiceReaction | undefined = reactionService.reactions[applet.reaction.name];

        if (!reaction) {
          return;
        }

        const outputResult: OutputResult = await applet.reaction.getOutputParams(data, selectedApplet.config, request);

        if (outputResult.required_params) {
          for (let requiredParam of outputResult.required_params) {
            if (!requiredParam) {
              return;
            }
          }
        }

        if (!selectedApplet.is_enabled) {
          return;
        }

        let providedClient = await pool.connect();

        try {
          const providedReaction = await providedClient.query(
            `SELECT providers.*
            FROM providers
            JOIN user_providers ON providers.id = user_providers.provider_id
            JOIN users ON user_providers.user_id = users.id
            WHERE users.id = $1
              AND providers.account_name = $2`,
            [data.user.id, reactionService.name]
          );

          await reaction.handleReaction(data, outputResult.params, providedReaction.rows[0]);
        } catch (error) {
          console.error(error);
        } finally {
          providedClient?.release();
        }
      })
    );
  } catch (error) {
    console.error('routes/webhook.ts', error);
  } finally {
    client?.release();
  }
});

export default routes;
