import { Applet } from '../../types/applet';
import { ActionData } from '../../types/action_data';
import { InputParams, OutputResult } from '../../types/service_reaction';

export const applet: Applet = {
  name: 'twitch_stream_start_notify_gmail',
  title: 'Notify on GMail when you start streaming',
  description: 'Notify a GMail when you start streaming.',

  fields: [
    {
      name: 'email_address',
      title: 'Email address',
    },
  ],

  action: {
    serviceName: 'twitch',
    name: 'stream_start',
  },

  reaction: {
    serviceName: 'google',
    name: 'send_email',

    getOutputParams: async ({ input }: ActionData, { email_address }: InputParams): Promise<OutputResult> => ({
      params: {
        email_address,
        message: `${input?.channel_name} has started a stream! 🎉 View it here : ${input?.stream_link}`,
      },
      required_params: [input?.channel_name, input?.stream_link],
    }),
  },
};
