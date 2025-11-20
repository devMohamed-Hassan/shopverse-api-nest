import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailConfig } from '../../../config';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  isEmailSended: boolean;
  info?: any;
  err?: string;
}

export const createEmailTransporter = (configService: ConfigService) => {
  const emailConfig = configService.get<EmailConfig>('email');
  
  if (!emailConfig?.user || !emailConfig?.pass) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS in .env');
  }

  return createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    service: emailConfig.service,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });
};

export const sendEmail = async (
  configService: ConfigService,
  options: SendEmailOptions,
): Promise<SendEmailResult> => {
  const emailConfig = configService.get<EmailConfig>('email');
  if (!emailConfig) {
    return { isEmailSended: false, err: 'Email configuration is missing' };
  }

  const transporter = createEmailTransporter(configService);

  try {
    const info = await transporter.sendMail({
      from: `"${emailConfig.senderName}" <${emailConfig.senderEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    const isEmailSended =
      Array.isArray(info?.accepted) && info.accepted.length > 0;
    return { isEmailSended, info };
  } catch (err) {
    return { isEmailSended: false, err: String(err) };
  }
};
