import { createHmac } from 'crypto';

const hashPassword = (password: string): string => {
  if (!process.env.HMAC_SECRET) {
    throw new Error('HMAC_SECRET is not set');
  }
  return createHmac('sha256', process.env.HMAC_SECRET).update(password).digest('hex');
};

const comparePassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export { hashPassword, comparePassword };
