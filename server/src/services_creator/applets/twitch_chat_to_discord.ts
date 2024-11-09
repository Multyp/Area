import { Applet } from '../../types/applet';
import { ActionData } from '../../types/action_data';
import { InputParams, OutputResult } from '../../types/service_reaction';

export const applet: Applet = {
  name: 'twitch_chat_to_discord',
  title: 'Re-transmit the Twitch chat to Discord in Live!',
  description: 'Re-transmit the Twitch chat to a Discord channel!',

  fields: [
    {
      name: 'webhook_url',
      title: 'Discord Webhook URL',
    },
  ],

  action: {
    serviceName: 'twitch',
    name: 'chat',
  },

  reaction: {
    serviceName: 'discord',
    name: 'send_message',

    getOutputParams: async ({ input }: ActionData, { webhook_url }: InputParams): Promise<OutputResult> => ({
      params: {
        webhook_url: webhook_url,
        message: `**${input?.chatter_name}** : ${input?.message}`,
      },
      required_params: [webhook_url, input?.chatter_name, input?.message],
    }),
  },
};
