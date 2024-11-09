import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../utils/db';
import { hashPassword } from '../utils/password';
import jwt, { JwtPayload } from 'jsonwebtoken';

const routes = Router();

async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const hashedPassword = hashPassword(password);

  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, hashedPassword]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = jwt.sign({ user_id: result.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

    res
      .cookie('token', token, {
        secure: false,
        domain: process.env.DOMAIN as string,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Logged in',
        user: result.rows[0],
        token,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) client.release();
  }
}

routes.post('/auth/login', [body('email').isEmail(), body('password').isLength({ min: 6 })], login);

export default routes;
