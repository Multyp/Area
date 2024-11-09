import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  max: 32,
  host: process.env.POSTGRES_HOST || 'db',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

export { pool };
