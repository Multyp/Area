import axios from 'axios';
import { ServiceAction } from '../../../types/service_action';
import { Request, Response } from 'express';
import { ActionResult } from '../../../types/action_data';
import { encodeFormURL } from '../../../utils/form_encoder';

const client_id: string = process.env.TWITCH_CLIENT_ID as string;
const client_secret: string = process.env.TWITCH_CLIENT_SECRET as string;
const webhook_secret: string = process.env.TWITCH_WEBHOOK_SECRET as string;
const developer_uuid: string | undefined = process.env.DEVELOPER_UUID;

async function subscribeWebhook(provided_id: string, type: string, reaction_name: string, condition: { [key: string]: string }) {
  let appResult = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    encodeFormURL({
      client_id,
      client_secret,
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  let result = await axios.post(
    `https://api.twitch.tv/helix/eventsub/subscriptions`,
    {
      type,
      version: '1',
      condition,
      transport: {
        method: 'webhook',
        callback: `https://myarea.tech${developer_uuid ? `/dev/${developer_uuid}` : ''}/api/webhook/twitch/${reaction_name}`,
        secret: webhook_secret,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${appResult.data.access_token}`,
        'Client-ID': client_id,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log(result?.data);

  return result;
}

export const serviceActions: ServiceAction[] = [
  {
    name: 'stream_start',
    description: 'Triggered when you start streaming.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'stream.online', 'stream_start', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            channel_name: body.event.broadcaster_user_name,
            started_at: body.event.started_at,
          },
          nonce: String(body.event.started_at),
        };
      }
    },
  },

  {
    name: 'stream_end',
    description: 'Triggered when you ended your stream.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'stream.offline', 'stream_end', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            channel_name: body.event.broadcaster_user_name,
            started_at: body.event.started_at,
          },
        };
      }
    },
  },

  {
    name: 'ban',
    description: 'Triggered when you ban someone.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.ban', 'ban', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            channel_login: body.event.broadcaster_user_login,
            channel_name: body.event.broadcaster_user_name,
            moderator_login: body.event.moderator_user_login,
            moderator_name: body.event.moderator_user_name,
            banned_user_login: body.event.user_login,
            banned_user_name: body.event.user_name,
            reason: body.event.reason,
            banned_at: body.event.banned_at,
            expires_at: body.event.ends_at,
          },
        };
      }
    },
  },

  {
    name: 'unban',
    description: 'Triggered when you unban someone.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.unban', 'unban', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            channel_login: body.event.broadcaster_user_login,
            channel_name: body.event.broadcaster_user_name,
            moderator_login: body.event.moderator_user_login,
            moderator_name: body.event.moderator_user_name,
            unbanned_user_login: body.event.user_login,
            unbanned_user_name: body.event.user_name,
          },
        };
      }
    },
  },

  {
    name: 'raid',
    description: 'Triggered when there is a new raid!',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.raid', 'raid', {
          from_broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            from_login: body.event.from_broadcaster_user_login,
            from_name: body.event.from_broadcaster_user_name,
            to_login: body.event.to_broadcaster_user_login,
            to_name: body.event.to_broadcaster_user_name,
            viewers: body.event.viewers,
          },
        };
      }
    },
  },

  {
    name: 'chat',
    description: 'Triggered when there is a new raid!',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.chat.message', 'chat', {
          broadcaster_user_id: provided_id,
          user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            chatter_login: body.event.chatter_user_login,
            chatter_name: body.event.chatter_user_name,
            message: body.event.message.text,
          },
          nonce: String(body.event.message_id),
        };
      }
    },
  },

  {
    name: 'follow',
    description: 'Triggered when there is a new follower to your channel.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.follow', 'follow', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            channel_login: body.event.broadcaster_user_login,
            channel_name: body.event.broadcaster_user_name,
            follower_login: body.event.user_login,
            follower_name: body.event.user_name,
            followed_at: body.event.followed_at,
          },
          nonce: 'follow:' + String(body.event.followed_at),
        };
      }
    },
  },

  {
    name: 'moderator_add',
    description: 'Triggered when a moderator is added to your channel.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.moderator.add', 'moderator_add', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            user_login: body.event.user_login,
            user_name: body.event.user_name,
            channel_login: body.event.broadcaster_user_login,
            channel_name: body.event.broadcaster_user_name,
          },
        };
      }
    },
  },

  {
    name: 'moderator_remove',
    description: 'Triggered when you remove all privileges from a moderator.',

    onSubscribe: async (provided_id: string, oauth_token: string): Promise<boolean> => {
      let result;

      try {
        result = await subscribeWebhook(provided_id, 'channel.moderator.remove', 'moderator_remove', {
          broadcaster_user_id: provided_id,
        });
      } catch (error) {
        console.log(error, result?.data);
        return false;
      }
      return true;
    },

    onWebhook: async ({ headers, body }: Request, response: Response): Promise<ActionResult | undefined> => {
      console.log('[twitch webhook] Received this webhook:', headers, body);

      if (headers['twitch-eventsub-message-type'] == 'webhook_callback_verification') {
        response.set('Content-Type', 'text/plain').status(200).send(body.challenge);

        return {
          is_response_ended: true,
        };
      }

      if (headers['twitch-eventsub-message-type'] == 'notification') {
        response.status(204);

        return {
          provided_user_id: body.event.broadcaster_user_id,
          input: {
            stream_link: `https://twitch.tv/${body.event.broadcaster_user_login}`,
            user_login: body.event.user_login,
            user_name: body.event.user_name,
            channel_login: body.event.broadcaster_user_login,
            channel_name: body.event.broadcaster_user_name,
          },
        };
      }
    },
  },
];
