import { JwtPayload, verify } from 'jsonwebtoken';
import { pool } from '../utils/db';

export async function verifyToken(token: string): Promise<number | undefined> {
  let decoded: JwtPayload | string = '';
  let client;

  if (token) {
    decoded = verify(token, process.env.JWT_SECRET as string);
  }

  if (typeof decoded == 'string') {
    return;
  }

  try {
    client = await pool.connect();

    if (typeof decoded != 'string') {
      let userExistsResult = await client.query('SELECT 1 FROM users WHERE id = $1', [decoded.user_id]);

      if ((userExistsResult.rowCount as number) > 0) {
        return decoded.user_id;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    client?.release();
  }
}
