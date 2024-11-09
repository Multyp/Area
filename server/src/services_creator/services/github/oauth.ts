import { AuthorizationRequest, ServiceOAuth, TokenRequest, UserIdRequest } from '../../../types/service_oauth';
import { config } from 'dotenv';

config();

const client_id: string = process.env.GITHUB_CLIENT_ID as string;
const client_secret: string = process.env.GITHUB_CLIENT_SECRET as string;

const getAuthorizationRequest = (redirect_uri: string): AuthorizationRequest => ({
  baseUrl: 'https://github.com/login/oauth/authorize',

  queries: {
    client_id,
    redirect_uri,
    scope: ['user', 'repo'],
  },
});

const getTokenRequest = (redirect_uri: string, code: string): TokenRequest => ({
  baseUrl: 'https://github.com/login/oauth/access_token',

  data: {
    client_id,
    client_secret,
    code,
    redirect_uri,
  },
});

const getUserIdRequest = (token: string): UserIdRequest => ({
  baseUrl: 'https://api.github.com/user',

  headers: {
    Authorization: `Bearer ${token}`,
  },

  parseResponse: (response: any): any => ({ id: response?.id }),
});

export const serviceOAuth: ServiceOAuth = {
  description: 'Github is a multinational technology company that specializes in internet-related services and products.',
  getAuthorizationRequest,
  getTokenRequest,
  getUserIdRequest,
};
