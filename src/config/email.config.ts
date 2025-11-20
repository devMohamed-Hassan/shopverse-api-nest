import { registerAs } from '@nestjs/config';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  service: string;
  user: string;
  pass: string;
  senderEmail: string;
  senderName: string;
}

export default registerAs('email', (): EmailConfig => {
  return {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465', 10),
    secure: process.env.EMAIL_SECURE !== 'false',
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    senderEmail: process.env.SENDER_EMAIL || process.env.EMAIL_USER || '',
    senderName: process.env.SENDER_NAME || 'Shopverse',
  };
});

