// Global imports
import { Router, Request, Response } from 'express';

// Scoped imports
import { ServiceAction } from '../../types/service_action';
import { createAllApplets, createAllServices } from '../creator';
import { pool } from '../../utils/db';
import validateBody from '../../utils/validate_body';
import actionReactionSchema from '../../schemas/action_reaction';
import { Applet, Applets } from '../../types/applet';
import { verifyToken } from '../../utils/verify_token';
import { Connection, getUserConnections } from '../../utils/get_user_connections';
import { ServiceReaction } from '../../types/service_reaction';
import { formatName } from '../../utils/format_name';

const routes: Router = Router();

routes.post('/api/applets/:applet_name/disable', async (request: Request, response: Response) => {
  const { token } = request.body;
  const { applet_name } = request.params;

  const userId: number | undefined = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  const applets: Applets | undefined = await createAllApplets(userId);

  if (!applets) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!applets.hasOwnProperty(applet_name)) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  const applet: Applet = applets[applet_name];

  let client;

  try {
    client = await pool.connect();

    let selected = await client.query(
      `UPDATE ${applet.is_custom ? 'custom_' : ''}applets SET is_enabled = false WHERE name = $1 AND user_id = $2 AND is_enabled = $3`,
      [applet_name, userId, true]
    );

    if (selected.rowCount === 0) {
      return response.status(404).json({ message: 'Applet not found' });
    }

    return response.status(200).json({ message: 'Applet disabled' });
  } catch (error) {
    console.error(error);
  }

  return response.status(500).json({ message: 'Internal server error' });
});

routes.post('/api/applets/:applet_name/enable', async (request: Request, response: Response) => {
  const { token, webhook_url, email_address } = request.body;
  const { applet_name } = request.params;

  const userId: number | undefined = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  const services = await createAllServices();
  const applets: Applets | undefined = await createAllApplets(userId);

  if (!services || !applets) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!(applet_name in applets)) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  const applet = applets[applet_name];

  if (!applet) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  let client;

  try {
    client = await pool.connect();

    let selected = await client.query(
      `SELECT p.account_id, p.account_name, p.account_email, p.account_token
      FROM providers p
      JOIN user_providers up ON up.provider_id = p.id
      WHERE up.user_id = $1 AND (p.account_name = $2 OR p.account_name = $3)`,
      [userId, applet.action.serviceName, applet.reaction.serviceName]
    );

    if (selected.rowCount === 0) {
      return response.status(404).json({ message: 'User need to be linked to an OAuth provider' });
    }

    let foundAction: ServiceAction | undefined;
    let selectedAction: any | undefined;
    let isReactionAvailable = false;

    await Promise.all(
      selected.rows.map(async (row, index: number) => {
        if (row.account_name == applet.action.serviceName) {
          foundAction = services[applet.action.serviceName].actions[applet.action.name];
          selectedAction = selected.rows[index];
        }

        if (row.account_name == applet.reaction.serviceName) {
          isReactionAvailable = true;
        }
      })
    );

    if (!foundAction || !selectedAction || !isReactionAvailable) {
      return response.status(403).json({ message: 'You must login via OAuth to enable this applet' });
    }

    if (!applet.is_custom) {
      await client.query(
        `INSERT INTO applets (user_id, name, config)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, name)
        DO UPDATE SET config = EXCLUDED.config, is_enabled = true
        RETURNING *;`,
        [userId, applet_name, { webhook_url, email_address }]
      );
    } else {
      await client.query('UPDATE custom_applets SET is_enabled = true WHERE user_id = $1 AND name = $2', [userId, applet_name]);
    }

    try {
      foundAction.onSubscribe(selectedAction.account_id, selectedAction.account_token);
    } catch {}

    return response.status(200).json({ success: true, message: 'Applet enabled' });
  } catch (error) {
    console.error(error);
  } finally {
    client?.release();
  }
});

routes.post('/api/applets', async (request: Request, response: Response) => {
  const { token } = request.body;

  if (!token) {
    return response.status(400).json({ message: 'Missing token' });
  }

  const userId = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Invalid token' });
  }

  let client;

  try {
    client = await pool.connect();

    const appletsResult = await client.query('SELECT name, is_enabled FROM applets WHERE user_id = $1', [userId]);

    const customAppletsResult = await client.query('SELECT name, is_enabled FROM custom_applets WHERE user_id = $1', [userId]);

    const appletsEnabledStatus: { [name: string]: boolean } = {};

    appletsResult.rows.forEach((row: any) => {
      appletsEnabledStatus[row.name] = row.is_enabled;
    });

    customAppletsResult.rows.forEach((row: any) => {
      appletsEnabledStatus[row.name] = row.is_enabled;
    });

    const applets: Applets | undefined = await createAllApplets(userId);

    if (applets) {
      for (const appletName in applets) {
        if (applets.hasOwnProperty(appletName)) {
          const applet = applets[appletName];
          applet.is_enabled = appletsEnabledStatus[appletName] ?? false;
          applet.is_custom = customAppletsResult.rows.some((row: any) => row.name === appletName);
        }
      }
    }

    return response.json(applets);
  } catch (error) {
    console.error(error);
  }
});

routes.post('/api/applets/:applet_name', async (request: Request, response: Response) => {
  const { applet_name } = request.params;
  const { token } = request.body;

  if (!token) {
    return response.status(400).json({ message: 'Missing token' });
  }

  const userId = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Invalid token' });
  }

  const services = await createAllServices();
  const applets: Applets | undefined = await createAllApplets(userId);

  if (!services || !applets) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!applets.hasOwnProperty(applet_name)) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  const applet = applets[applet_name];

  if (!applet) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  let result = {
    title: applet.title,
    description: applet.description,
    fields: applet.fields,
    isEnabled: false,
  };

  let client;

  try {
    client = await pool.connect();

    const selected = await client.query(
      `SELECT is_enabled FROM ${applet.is_custom ? 'custom_' : ''}applets WHERE user_id = $1 AND name = $2`,
      [userId, applet_name]
    );

    if (selected.rows.length > 0) {
      if (selected.rows[0].is_enabled) {
        result.isEnabled = true;
      }
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Internal server error' });
  } finally {
    client?.release();
  }

  return response.status(200).json(result);
});

/**
 * Inserts a new custom applet into the database and returns the inserted applet's ID.
 *
 * @swagger
 * /api/create_custom_applet:
 *   post:
 *     summary: Create a new custom applet
 *     tags: [Applets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               user_id:
 *                 type: integer
 *               action_service_name:
 *                 type: string
 *               action_name:
 *                 type: string
 *               action_params:
 *                 type: object
 *               reaction_service_name:
 *                 type: string
 *               reaction_name:
 *                 type: string
 *               reaction_params:
 *                 type: object
 *     responses:
 *       200:
 *         description: The ID of the newly created custom applet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *
 * @param {string} name - The name of the custom applet.
 * @param {number} userId - The ID of the user creating the applet.
 * @param {object} action - The action details of the applet.
 * @param {string} action.service_name - The name of the action service.
 * @param {string} action.name - The name of the action.
 * @param {object} [action.params] - The parameters for the action.
 * @param {object} reaction - The reaction details of the applet.
 * @param {string} reaction.service_name - The name of the reaction service.
 * @param {string} reaction.name - The name of the reaction.
 * @param {object} [reaction.fields] - The parameters for the reaction.
 * @returns {Promise<{ id: number }>} The ID of the newly created custom applet.
 */
routes.post('/api/create_custom_applet', validateBody(actionReactionSchema), async (request: Request, response: Response) => {
  const { token, name, action, reaction } = request.body;

  const userId: number | undefined = await verifyToken(token);
  const services = await createAllServices();
  const applets = await createAllApplets();

  if (!userId) {
    console.log('no_userid');
    return response.status(401).json({ message: 'Invalid token' });
  }

  if (!services || !applets) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!services.hasOwnProperty(action.service_name) || !services.hasOwnProperty(reaction.service_name)) {
    console.log('Request body:', request.body);
    return response.status(404).json({ message: 'Service for the action or the reaction not found' });
  }

  const actionService = services[action.service_name];
  const reactionService = services[reaction.service_name];

  if (!actionService.actions[action.name] || !reactionService.reactions[reaction.name]) {
    return response.status(404).json({ message: 'Action or reaction not found' });
  }

  const foundAction: ServiceAction | undefined = actionService.actions[action.name];
  const foundReaction: ServiceReaction | undefined = reactionService.reactions[reaction.name];
  const userConnections: Connection[] = await getUserConnections(userId);

  if (!actionService || !foundAction || !foundReaction) {
    return response.status(404).json({ message: 'One or many services/actions/reactions not found' });
  }

  if (
    !userConnections.some((connection) => actionService.name === connection.serviceName) ||
    !userConnections.some((connection) => reactionService.name === connection.serviceName)
  ) {
    return response.status(400).json({ message: 'User not linked to the required services' });
  }

  let client;

  try {
    client = await pool.connect();

    let selected = await client.query(
      `SELECT providers.* FROM providers JOIN user_providers ON providers.id = user_providers.provider_id WHERE user_providers.user_id = $1 AND providers.account_name = $2`,
      [userId, actionService.name]
    );

    if (selected.rowCount !== 1) {
      return response.status(404).json({ message: 'User not found' });
    }

    console.log('Found selected user:', selected.rows[0]);
    foundAction.onSubscribe(selected.rows[0].account_id, selected.rows[0].account_token);

    const insertResult = await client.query(
      `INSERT INTO custom_applets (
        name, user_id, action_service_name, action_name, action_params,
        reaction_service_name, reaction_name, reaction_params
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        formatName(name),
        userId,
        action.service_name,
        action.name,
        action.params || null,
        reaction.service_name,
        reaction.name,
        reaction.fields || null,
      ]
    );

    const insertedAppletId = insertResult.rows[0].id;

    return response.status(201).json({
      success: true,
      message: 'Applet created',
      applet_id: insertedAppletId,
    });
  } catch (error) {
    console.error('Error while creating the custom applet:', error);
    return response.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

routes.post('/api/custom_applets', async (request: Request, response: Response) => {
  const { token } = request.body;

  const userId = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Invalid token' });
  }

  let client;

  try {
    client = await pool.connect();

    const customAppletsResult = await client.query('SELECT name, is_enabled FROM custom_applets WHERE user_id = $1', [userId]);

    return response.status(200).json({ applets: customAppletsResult.rows });
  } catch (error) {
    console.error(error);
  } finally {
    client?.release();
  }
  return response.status(500).json({ message: 'Internal server error' });
});

export default routes;
