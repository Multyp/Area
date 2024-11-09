import axios from 'axios';
import { ServiceAction } from '../../../types/service_action';
import { Request, Response } from 'express';
import { pool } from '../../../utils/db';
import { InputParams, OutputParams } from '@/types/service_reaction';

export const serviceActions: ServiceAction[] = [
  /*{
    name: 'github_issue_created',
    description: 'A new issue was created',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let client;
      let owner;
      let repo;
      try {
        client = await pool.connect();
        const selected = await client.query(
          `SELECT config
          FROM applets
          WHERE user_id = $1;`,
          [provided_id]
        );
        const config = selected.rows[0].config;
        owner = config.owner;
        repo = config.repo;
      } catch (error) {
        console.error(error);
        return false;
      }

      try {
        const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
          owner: owner,
          repo: repo,
          name: 'web',
          active: true,
          events: ['issues'],
          config: {
            url: `${process.env.APP_URL}/webhook/github`,
            content_type: 'json',
          },
          headers: {
            Authorization: `Bearer ${oauth_token}`,
            Accept: 'application/vnd.github+json',
          },
        });
        console.log(response.data);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    onWebhookReceived: async (
      request: Request,
      response: Response,
      handleReaction: (params: Params, outputParams: OutputParams) => Promise<void>
    ): Promise<Response> => {
      const event = request.headers['x-github-event'];

      if (event !== 'issues' || request.body.action !== 'opened') {
        return response.status(200).json({ message: 'Événement ignoré' });
      }

      let client;

      try {
        let parsed = JSON.parse(Buffer.from(request.body.message.data, 'base64').toString());
        client = await pool.connect();
        let selected = await client.query(
          `SELECT p.account_id, p.account_name, p.account_email, p.account_token
          FROM providers p
          JOIN user_providers up ON up.provider_id = p.id
          WHERE p.account_email = $1;`,
          [parsed.emailAddress]
        );

        if (!selected.rows[0].account_token) {
          return response.status(200).json({});
        }

        await handleReaction(
          {
            user: {
              id: selected.rows[0].account_id,
            },
            providedUser: {
              id: selected.rows[0].account_id,
              email: parsed.emailAddress,
              token: selected.rows[0].account_token,
            },
          },
          {
            repo: parsed.repository.name,
          }
        );
        return response.status(200).json({});
      } catch (error) {
        console.error(error);
      } finally {
        client?.release();
      }
      return response.status(200).json({});
    },
  },
*/
];
