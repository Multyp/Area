import { ActionData } from '../../../types/action_data';
import { OutputParams, ServiceReaction } from '../../../types/service_reaction';
import { pool } from '../../../utils/db';
import axios from 'axios';

export const serviceReactions: ServiceReaction[] = [
  {
    name: 'send_message',
    description: 'Send a message in the selected channel',
    required_fields: ['webhook_url', 'message'],

    handleReaction: async ({}: ActionData, { webhook_url, message }: OutputParams): Promise<void> => {
      let client;

      try {
        client = await pool.connect();

        await axios.post(webhook_url, {
          content: message,
          username: 'AREA',
        });
      } catch (error) {
        console.error(error);
      } finally {
        client?.release();
      }
    },
  },
];
