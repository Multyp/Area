## Process: How to add an OAuth service?

1. Find the page that allows you to create OAuth credentials, you must retreive at least a client ID and a client secret.

2. Edit the `.env` file at the root of the `/server` project.
   You might want to add: `[SERVICE_NAME_HERE]_CLIENT_ID` and `[SERVICE_NAME_HERE]_CLIENT_SECRET` values.

3. Create a the new folder and the new `oauth.ts` file at this location: `@/services/[SERVICE_NAME_HERE]/oauth.ts`

4. Paste and edit this example so it fit the needs of the service provider:

```ts
import { AuthorizationRequest, ServiceOAuth, TokenRequest, UserIdRequest } from '@/types/service_oauth';
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
    scope: ['identify', 'guilds.join'],
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

  parseResponse: (response: any): any => response?.id,
});

export const serviceOAuth: ServiceOAuth = {
  getAuthorizationRequest,
  getTokenRequest,
  getUserIdRequest,
};
```

5. Test your route in your browser: http://localhost:8080/api/oauth/[SERVICE_NAME_HERE]/authorize by clicking "authorize".

6. Check that the data are successfully inserted in the database: `psql -U root -d mydb -h 127.0.0.1 -p 5432`.

```sql
\c mydb
SELECT * FROM users;
SELECT * FROM providers;
```

You should see a user and a provider which represents your service.
Also, try to re-authorize and check if everything still works. If so, your service is ready for the `dev` branch.
