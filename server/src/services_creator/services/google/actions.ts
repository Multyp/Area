// Global imports
import axios from 'axios';
import { Request } from 'express';

// Scpoped imports
import { ServiceAction } from '../../../types/service_action';
import { ActionResult } from '../../../types/action_data';
import { pool } from '../../../utils/db';

export const serviceActions: ServiceAction[] = [
  {
    name: 'email_received',
    description: 'Received an email',

    onSubscribe: async (_: string, oauth_token: string): Promise<boolean> => {
      let response;

      try {
        response = await axios.post(
          `https://www.googleapis.com/gmail/v1/users/me/watch`,
          {
            topicName: 'projects/macro-precinct-435909-s8/topics/email_received',
            labelIds: ['INBOX'],
            labelFilterBehavior: 'INCLUDE',
          },
          {
            headers: {
              Authorization: `Bearer ${oauth_token}`,
            },
          }
        );

        console.log('Pub/Sub:', response.data);
      } catch (error) {
        console.log(error, response?.data);
        return false;
      }

      return true;
    },

    onWebhook: async ({ body }: Request): Promise<ActionResult | undefined> => {
      let parsed = JSON.parse(Buffer.from(body.message.data, 'base64').toString());

      let client;

      try {
        client = await pool.connect();

        let selected = await client.query(
          `SELECT account_id, account_token FROM providers WHERE account_email = $1 AND account_name = $2`,
          [parsed.emailAddress, 'google']
        );

        if (!selected.rows[0].account_id) {
          return;
        }

        return {
          provided_user_id: selected.rows[0].account_id,
          nonce: body.message.message_id,
        };
      } catch (error) {
        console.log('google/actions.ts', error);
      } finally {
        client?.release();
      }
    },
  },
  {
    name: 'event_added',
    description: 'A new event is added to a calendar',

    onSubscribe: async (_: string, oauth_token: string): Promise<boolean> => {
      let response;

      try {
        response = await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/my_calendar@gmail.com/events/watch`,
          {
            topicName: 'projects/macro-precinct-435909-s8/topics/event_added',
            labelIds: ['INBOX'],
            labelFilterBehavior: 'INCLUDE',
          },
          {
            headers: {
              Authorization: `Bearer ${oauth_token}`,
            },
          }
        );

        console.log('Pub/Sub:', response.data);
      } catch (error) {
        console.error(error);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request): Promise<ActionResult | undefined> => {
      console.log('Received a webhook for event_added:', headers.from);

      let client;

      try {
        let parsed = JSON.parse(Buffer.from(body.message.data, 'base64').toString());

        console.log('--- GMAIL ---', headers, body, parsed);
        client = await pool.connect();
        let selected = await client.query(
          `SELECT p.account_id, p.account_name, p.account_email, p.account_token
          FROM providers p
          JOIN user_providers up ON up.provider_id = p.id
          WHERE p.account_email = $1;`,
          [parsed.emailAddress]
        );

        if (!selected.rows[0].account_token) {
          return;
        }

        return {
          provided_user_id: selected.rows[0].account_id,
        };
      } catch (error) {
        console.error(error);
      } finally {
        client?.release();
      }
    },
  },
];
