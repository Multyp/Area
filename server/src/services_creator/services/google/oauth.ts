import { AuthorizationRequest, ServiceOAuth, TokenRequest, UserIdRequest } from '../../../types/service_oauth';
import { config } from 'dotenv';

config();

const client_id: string = process.env.GOOGLE_CLIENT_ID as string;
const client_secret: string = process.env.GOOGLE_CLIENT_SECRET as string;

const getAuthorizationRequest = (redirect_uri: string): AuthorizationRequest => ({
  baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',

  queries: {
    response_type: 'code',
    client_id,
    redirect_uri,
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.metadata',
      'https://www.googleapis.com/auth/gmail.send',
    ],
  },
});

const getTokenRequest = (redirect_uri: string, code: string): TokenRequest => ({
  baseUrl: 'https://oauth2.googleapis.com/token',

  data: {
    client_id,
    client_secret,
    code,
    grant_type: 'authorization_code',
    redirect_uri,
  },
});

const getUserIdRequest = (token: string): UserIdRequest => ({
  baseUrl: 'https://www.googleapis.com/oauth2/v1/userinfo',

  headers: {
    Authorization: `Bearer ${token}`,
  },

  parseResponse: (response: any): any => ({
    id: response?.id,
    email: response?.email,
  }),
});

export const serviceOAuth: ServiceOAuth = {
  description: 'Google is a multinational technology company that specializes in internet-related services and products.',
  getAuthorizationRequest,
  getTokenRequest,
  getUserIdRequest,
};
