import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../utils/db';
import { hashPassword } from '../utils/password';
import jwt from 'jsonwebtoken';

const routes = Router();

async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const hashedPassword = hashPassword(password);

  let client;
  try {
    client = await pool.connect();
    const result = await client.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);

    const token = jwt.sign({ user_id: result.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });

    res
      .cookie('token', token, {
        secure: false,
        domain: process.env.DOMAIN as string,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: 'User created',
        user: result.rows[0],
        token: jwt.sign({ user_id: result.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '30d' }),
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) client.release();
  }
}

routes.post('/auth/register', [body('email').isEmail(), body('password').isLength({ min: 6 })], register);

export default routes;
