import { Applet } from '../../types/applet';
import { OutputResult } from '@/types/service_reaction';
import { ActionData } from '@/types/action_data';

export const applet: Applet = {
  name: 'calendar_notify_discord',
  title: 'Calendar to Discord Notifications',
  description: 'Notify a Discord channel when a new event calendar is received',

  fields: [
    {
      name: 'webhook_url',
      title: 'Discord Webhook URL',
    },
  ],

  action: {
    serviceName: 'google',
    name: 'event_added',
  },

  reaction: {
    serviceName: 'discord',
    name: 'send_message',

    getOutputParams: async ({ provided_user }: ActionData): Promise<OutputResult> => ({
      params: {
        message: `New email received in your ${provided_user.email} calendar!`,
      },
      required_params: [provided_user.email],
    }),
  },
};
