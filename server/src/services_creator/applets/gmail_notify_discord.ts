import { Applet } from '../../types/applet';
import { ActionData } from '../../types/action_data';
import { InputParams, OutputResult } from '../../types/service_reaction';

export const applet: Applet = {
  name: 'gmail_notify_discord',
  title: 'Gmail to Discord Notifications',
  description: 'Notify a Discord channel when a new email is received',

  fields: [
    {
      name: 'webhook_url',
      title: 'Discord Webhook URL',
    },
  ],

  action: {
    serviceName: 'google',
    name: 'email_received',
  },

  reaction: {
    serviceName: 'discord',
    name: 'send_message',

    getOutputParams: async ({ provided_user }: ActionData, { webhook_url }: InputParams): Promise<OutputResult> => ({
      params: {
        webhook_url,
        message: `New email received at your ${provided_user.email} inbox!`,
      },
      required_params: [webhook_url, provided_user.email],
    }),
  },
};
