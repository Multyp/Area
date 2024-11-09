import { Applet } from '../../types/applet';
import { ActionData } from '../../types/action_data';
import { InputParams, OutputResult } from '../../types/service_reaction';

export const applet: Applet = {
  name: 'twitch_stream_start_notify_discord',
  title: 'Notify on Discord when you start streaming',
  description: 'Notify a Discord channel when you are streaming.',

  fields: [
    {
      name: 'webhook_url',
      title: 'Discord Webhook URL',
    },
  ],

  action: {
    serviceName: 'twitch',
    name: 'stream_start',
  },

  reaction: {
    serviceName: 'discord',
    name: 'send_message',

    getOutputParams: async ({ input }: ActionData, { webhook_url }: InputParams): Promise<OutputResult> => ({
      params: {
        webhook_url: webhook_url,
        message: `${input?.channel_name} has started a stream! 🎉 View it here : ${input?.stream_link}`,
      },
      required_params: [webhook_url, input?.channel_name],
    }),
  },
};
