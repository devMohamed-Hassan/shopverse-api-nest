import { ConfigModuleOptions } from '@nestjs/config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import emailConfig from './email.config';
import appConfig from './app.config';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: ['.env', 'config/.env.dev', '.env.dev'],
  isGlobal: true,
  expandVariables: true,
  ignoreEnvFile: false,
  load: [databaseConfig, jwtConfig, emailConfig, appConfig],
};

export * from './database.config';
export * from './jwt.config';
export * from './email.config';
export * from './app.config';

