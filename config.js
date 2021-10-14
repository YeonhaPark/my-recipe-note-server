import dotenv from 'dotenv';

dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value === null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}
export const config = {
  auth: {
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
    bcryptSaltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  port: parseInt(required('PORT', 8081)),
  db: {
    port: required('DB_PORT'),
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
  cors: {
    allowedOrigin: required('CORS_ALLOW_ORIGIN'),
  },
};
