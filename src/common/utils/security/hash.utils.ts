import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { APP_CONSTANTS } from '../../../constants';

export const hash = async (
  plainText: string,
  configService?: ConfigService,
): Promise<string> => {
  let saltRounds: number = APP_CONSTANTS.DEFAULT_SALT_ROUNDS;

  if (configService) {
    const appConfig = configService.get<AppConfig>('app');
    saltRounds = appConfig?.saltRounds || APP_CONSTANTS.DEFAULT_SALT_ROUNDS;
  } else {
    saltRounds = Number(process.env.SALT_ROUNDS) || APP_CONSTANTS.DEFAULT_SALT_ROUNDS;
  }

  return await bcrypt.hash(plainText, saltRounds);
};

export const compare = async (
  plainText: string,
  hashedText: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainText, hashedText);
};
