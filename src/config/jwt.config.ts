import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export default registerAs('jwt', (): JwtConfig => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is required in environment variables');
  }

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is required in environment variables');
  }

  return {
    accessTokenSecret,
    refreshTokenSecret,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  };
});

