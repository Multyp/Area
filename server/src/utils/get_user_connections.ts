import { pool } from './db';

export type Connection = {
  serviceName: string;
  email: string;
};

export async function getUserConnections(userId: number): Promise<Connection[]> {
  const connections = await pool.query(
    `SELECT p.*
    FROM providers p
    INNER JOIN user_providers up ON p.id = up.provider_id
    WHERE up.user_id = $1;`,
    [userId]
  );

  return Object.values(connections.rows).map((connection) => ({
    serviceName: connection.account_name,
    email: connection.account_email,
  }));
}
