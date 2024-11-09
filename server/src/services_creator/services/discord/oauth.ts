import { AuthorizationRequest, ServiceOAuth, TokenRequest, UserIdRequest } from '../../../types/service_oauth';
import { config } from 'dotenv';

config();

const client_id: string = process.env.DISCORD_CLIENT_ID as string;
const client_secret: string = process.env.DISCORD_CLIENT_SECRET as string;

const getAuthorizationRequest = (redirect_uri: string): AuthorizationRequest => ({
  baseUrl: 'https://discord.com/oauth2/authorize',

  queries: {
    response_type: 'code',
    client_id,
    redirect_uri,
    scope: ['identify', 'guilds', 'bot'],
    bot: 'true',
    guild_select: 'true',
    permissions: '2048',
  },
});

const getTokenRequest = (redirect_uri: string, code: string): TokenRequest => ({
  baseUrl: 'https://discord.com/api/v10/oauth2/token',

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
  },

  data: {
    grant_type: 'authorization_code',
    code,
    redirect_uri,
  },
});

const getUserIdRequest = (token: string): UserIdRequest => ({
  baseUrl: 'https://discord.com/api/users/@me',

  headers: {
    Authorization: `Bearer ${token}`,
  },

  parseResponse: (response: any): any => ({ id: response?.id }),
});

export const serviceOAuth: ServiceOAuth = {
  description:
    'Discord is a free VoIP application and digital distribution platform designed for creating communities ranging from games to education and businesses.',
  getAuthorizationRequest,
  getTokenRequest,
  getUserIdRequest,
};
