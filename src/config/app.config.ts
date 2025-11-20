import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  env: string;
  name: string;
  saltRounds: number;
  otpExpirationMinutes: number;
}

export default registerAs('app', (): AppConfig => {
  return {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'Shopverse',
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
    otpExpirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || '10', 10),
  };
});

