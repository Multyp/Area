import { Applet } from '../../types/applet';
import { ActionData } from '../../types/action_data';
import { InputParams, OutputResult } from '../../types/service_reaction';

export const applet: Applet = {
  name: 'twitch_ban_notify_gmail',
  title: 'Notify on GMail when someone is banned',
  description: 'Notify on GMail when someone is banned.',

  fields: [
    {
      name: 'email_address',
      title: 'Email address',
    },
  ],

  action: {
    serviceName: 'twitch',
    name: 'chat',
  },

  reaction: {
    serviceName: 'google',
    name: 'send_email',

    getOutputParams: async ({ input }: ActionData, { email_address }: InputParams): Promise<OutputResult> => ({
      params: {
        email_address,
        message: `**${input?.moderator_name}** has banned **${input?.banned_user_name}** from the channel **${input?.channel_name}**`,
      },
      required_params: [email_address, input?.moderator_name, input?.banned_user_name, input?.channel_name],
    }),
  },
};
