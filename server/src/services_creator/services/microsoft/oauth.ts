import { AuthorizationRequest, ServiceOAuth, TokenRequest, UserIdRequest } from '../../../types/service_oauth';
import { config } from 'dotenv';

config();

const client_id: string = process.env.MICROSOFT_CLIENT_ID as string;
const client_secret: string = process.env.MICROSOFT_CLIENT_SECRET as string;
const tenant_id: string = process.env.MICROSOFT_TENANT_ID as string;

const getAuthorizationRequest = (redirect_uri: string): AuthorizationRequest => ({
  baseUrl: `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/authorize`,

  queries: {
    response_type: 'code',
    client_id,
    redirect_uri,
    scope: ['User.Read', 'Mail.Send', 'Mail.ReadWrite'],
    response_mode: 'query',
  },
});

const getTokenRequest = (redirect_uri: string, code: string): TokenRequest => ({
  baseUrl: `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },

  data: {
    client_id,
    client_secret,
    code,
    grant_type: 'authorization_code',
    redirect_uri,
  },
});

const getUserIdRequest = (token: string): UserIdRequest => ({
  baseUrl: 'https://graph.microsoft.com/v1.0/me',

  headers: {
    Authorization: `Bearer ${token}`,
  },

  parseResponse: (response: any): any => ({ id: response?.id }),
});

export const serviceOAuth: ServiceOAuth = {
  description: 'Microsoft is a multinational technology company that specializes in internet-related services and products.',
  getAuthorizationRequest,
  getTokenRequest,
  getUserIdRequest,
};
