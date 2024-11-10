// Global imports
import { Router, Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Scoped imports
import { AuthorizationRequest, TokenRequest, UserIdRequest } from '../../types/service_oauth';
import { pool } from '../../utils/db';
import { createAllServices } from '../creator';
import { verifyToken } from '../../utils/verify_token';

const unauthorizedPath = '/login/oauth/unauthorized';

const routes: Router = Router();

/**
 * @swagger
 * /api/oauth/{service_name}/authorize:
 *   get:
 *     summary: Initiates OAuth authorization for a specified service
 *     tags: [OAuth]
 *     parameters:
 *       - in: path
 *         name: service_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the OAuth service (e.g., Google, Discord)
 *     responses:
 *       302:
 *         description: Redirects to the authorization URL of the OAuth service
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
routes.get('/api/oauth/:service_name/authorize', async (request: Request, response: Response) => {
  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  const { service_name } = request.params;

  if (!(service_name in services)) {
    return response.status(404).json({ message: 'Service not found' });
  }

  const service = services[service_name];

  const redirectUri: string = `${process.env.API_BASE_URL}/api/oauth/${service_name}/callback`;
  const authorizationRequest: AuthorizationRequest = service.oauth.getAuthorizationRequest(redirectUri);

  let authorizationUrl: string = authorizationRequest.baseUrl;

  Object.entries(authorizationRequest.queries).map((keyValue: [string, string | string[]], index: number) => {
    let [key, value] = keyValue;

    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value = value.map((v) => encodeURIComponent(v)).join('%20');
    } else if (typeof value !== 'string') {
      value = encodeURIComponent(String(value));
    }

    if (key === 'redirect_uri') {
      value = encodeURIComponent(value);
    }

    authorizationUrl += `${index === 0 ? '?' : '&'}${key}=${value}`;
  });

  return response.redirect(authorizationUrl);
});

const encodeFormURL = (x: { [key: string]: string }) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

/**
 * @swagger
 * /api/oauth/{service_name}/callback:
 *   get:
 *     summary: Handles OAuth callback and processes authorization code
 *     tags: [OAuth]
 *     parameters:
 *       - in: path
 *         name: service_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the OAuth service (e.g., Google, Discord)
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: The authorization code from the OAuth service
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: boolean
 *         description: If true, handles the callback as a mobile response
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: JWT token for existing user verification
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       302:
 *         description: Redirects to a URL for unauthorized access or on success
 *       400:
 *         description: Bad request, missing parameters
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
routes.get('/api/oauth/:service_name/callback', async (request: Request, response: Response) => {
  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }
  const { service_name } = request.params;

  if (!(service_name in services)) {
    return response.status(404).json({ message: 'Service not found' });
  }

  const service = services[service_name];

  if (!service) {
    return response.status(404).json({ message: 'Service not found' });
  }

  const redirectUri: string = `${process.env.API_BASE_URL}/api/oauth/${service_name}/callback`;
  const code = request.query.code;
  const mobile = request.query.mobile;
  const jwtToken = Array.isArray(request.query.token) ? request.query.token[0] : request.query.token;

  if (typeof code !== 'string') {
    if (mobile) {
      return response.status(400).json({ message: 'Bad request' });
    } else {
      return response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=${unauthorizedPath}`);
    }
  }

  const tokenRequest: TokenRequest = service.oauth.getTokenRequest(redirectUri, code);

  let tokenResponse;

  if (
    tokenRequest.headers?.hasOwnProperty('Content-Type')
      ? tokenRequest.headers['Content-Type'] == 'application/x-www-form-urlencoded'
      : false
  ) {
    tokenResponse = await axios.post(tokenRequest.baseUrl, encodeFormURL(tokenRequest.data), { headers: tokenRequest.headers });
  } else {
    tokenResponse = await axios.post(tokenRequest.baseUrl, tokenRequest.data, { headers: tokenRequest.headers });
  }

  let tokenJson: object = tokenResponse.data;

  if (typeof tokenResponse.data == 'string') {
    tokenJson = qs.parse(tokenResponse.data);
  }

  if (!('access_token' in tokenJson)) {
    if (!mobile) {
      return response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=${unauthorizedPath}`);
    } else {
      return response.status(401).json({ message: 'Unauthorized' });
    }
  }

  if (typeof tokenJson.access_token != 'string') {
    if (!mobile) {
      return response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=${unauthorizedPath}`);
    } else {
      return response.status(401).json({ message: 'Unauthorized' });
    }
  }

  const userIdRequest: UserIdRequest = service.oauth.getUserIdRequest(tokenJson.access_token);
  let result;

  if (!userIdRequest.method || userIdRequest.method == 'get') {
    result = await axios.get(userIdRequest.baseUrl, {
      headers: userIdRequest.headers,
    });
  } else {
    result = await axios[userIdRequest.method](userIdRequest.baseUrl, userIdRequest.data, {
      headers: userIdRequest.headers,
    });
  }

  const userId = userIdRequest.parseResponse(result.data);

  if (!userId) {
    if (!mobile) {
      return response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=${unauthorizedPath}`);
    } else {
      return response.status(401).json({ message: 'Unauthorized' });
    }
  }

  let client;

  try {
    client = await pool.connect();

    let insertedProvider;

    try {
      insertedProvider = await client.query(
        'INSERT INTO providers (account_name, account_id, account_token, account_email) VALUES ($1, $2, $3, $4) RETURNING *',
        [service.name, userId.id, tokenJson.access_token, userId.email]
      );
    } catch (error) {
      console.log('----', error);
      let selected = await client.query(
        `SELECT u.id
          FROM users u
          JOIN user_providers up ON u.id = up.user_id
          JOIN providers p ON up.provider_id = p.id
          WHERE p.account_id = $1`,
        [userId.id]
      );

      console.log(userId.id, selected.rows);

      const token = jwt.sign({ user_id: selected.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

      if (!mobile) {
        response.cookie('token', token, {
          secure: false,
          domain: process.env.DOMAIN as string,
          maxAge: 24 * 60 * 60 * 1000,
        });

        response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=/explore`);
      } else {
        return response.status(200).json({
          success: true,
          message: 'User logged-in back.',
          token,
        });
      }
      return;
    }

    if (insertedProvider.rowCount !== 1) {
      if (!mobile) {
        return response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=${unauthorizedPath}`);
      } else {
        return response.status(401).json({ message: 'Unauthorized' });
      }
    }

    let decoded: JwtPayload | string = '';
    let userExists: boolean = false;

    if (request.cookies['token']) {
      decoded = jwt.verify(request.cookies['token'], process.env.JWT_SECRET as string);
    }

    if (jwtToken) {
      decoded = jwt.verify(jwtToken as string, process.env.JWT_SECRET as string);
    }

    if (typeof decoded != 'string') {
      let userExistsResult = await client.query('SELECT 1 FROM users WHERE id = $1', [decoded.user_id]);

      if ((userExistsResult.rowCount as number) > 0) {
        userExists = true;
      }
    }

    if (!userExists) {
      let insertedUser = await client.query('INSERT INTO users (provider_id) VALUES ($1) RETURNING *', [insertedProvider.rows[0].id]);

      const token = jwt.sign({ user_id: insertedUser.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

      response.cookie('token', token, {
        secure: false,
        domain: process.env.DOMAIN as string,
        maxAge: 24 * 60 * 60 * 1000,
      });

      try {
        await client.query('INSERT INTO user_providers (user_id, provider_id) VALUES ($1, $2) RETURNING *', [
          insertedUser.rows[0].id,
          insertedProvider.rows[0].id,
        ]);
      } catch {}

      if (mobile) {
        return response.status(200).json({ success: true, message: 'User created successfully', token });
      }
    }

    if (typeof decoded != 'string') {
      try {
        await client.query('INSERT INTO user_providers (user_id, provider_id) VALUES ($1, $2) RETURNING *', [
          decoded.user_id,
          insertedProvider.rows[0].id,
        ]);
      } catch {}
    }

    if (!mobile) {
      return response.redirect(`${process.env.WEB_BASE_URL}/redirect?url=/explore`);
    } else {
      return response.status(200).json({ success: true, message: 'User logged-in' });
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (client) {
      client.release();
    }
  }
});

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Fetches user profile details
 *     tags: [OAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token for authentication
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           service_name:
 *                             type: string
 *                           service_email:
 *                             type: string
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
routes.post('/api/profile', async (request: Request, response: Response) => {
  const { token } = request.body;
  const userId: number | undefined = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Token invalide' });
  }

  let client;

  try {
    client = await pool.connect();

    const userResult = await client.query(
      `SELECT u.id, u.created_at,
        json_agg(json_build_object(
          'service_name', p.account_name,
          'service_email', p.account_email
        )) as services
      FROM users u
      LEFT JOIN user_providers up ON u.id = up.user_id
      LEFT JOIN providers p ON up.provider_id = p.id
      WHERE u.id = $1
      GROUP BY u.id`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return response.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userResult.rows[0];

    return response.status(200).json({
      success: true,
      profile: {
        id: user.id,
        created_at: user.created_at,
        services: user.services.filter((service: any) => service.service_name !== null),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return response.status(500).json({ message: 'Erreur interne du serveur' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

export default routes;
