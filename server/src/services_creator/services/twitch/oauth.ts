import { AuthorizationRequest, ServiceOAuth, TokenRequest, UserIdRequest } from '../../../types/service_oauth';
import { config } from 'dotenv';

config();

const client_id: string = process.env.TWITCH_CLIENT_ID as string;
const client_secret: string = process.env.TWITCH_CLIENT_SECRET as string;

const getAuthorizationRequest = (redirect_uri: string): AuthorizationRequest => ({
  baseUrl: 'https://id.twitch.tv/oauth2/authorize',

  queries: {
    client_id,
    force_verify: 'true',
    redirect_uri,
    response_type: 'code',
    scope: ['user:read:email', 'user:read:subscriptions', 'channel:read:subscriptions', 'user:read:chat', 'user:bot', 'channel:bot'],
  },
});

const getTokenRequest = (redirect_uri: string, code: string): TokenRequest => ({
  baseUrl: 'https://id.twitch.tv/oauth2/token',

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },

  data: {
    client_id,
    client_secret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirect_uri,
  },
});

const getUserIdRequest = (token: string): UserIdRequest => ({
  baseUrl: 'https://api.twitch.tv/helix/users',

  headers: {
    Authorization: `Bearer ${token}`,
    'Client-ID': client_id,
  },

  parseResponse: (response: any): any => {
    return { id: response?.data?.[0]?.id };
  },
});

export const serviceOAuth: ServiceOAuth = {
  description: 'Twitch is a multinational technology company that specializes in internet-related services and products.',
  getAuthorizationRequest,
  getTokenRequest,
  getUserIdRequest,
};
