import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export interface DatabaseConfig {
  uri: string;
  options: MongooseModuleOptions;
}

export const getDatabaseConfig = (): MongooseModuleOptions => ({
  onConnectionCreate: (connection: Connection) => {
    const log = (msg: string) =>
      console.log(`[MongoDB] ${new Date().toISOString()} - ${msg}`);

    connection.on('connected', () => log('Connection successfully.'));
    connection.on('open', () => log('Connection is now open.'));
    connection.on('disconnected', () => log('Connection lost.'));
    connection.on('reconnected', () => log('Reconnected to database.'));
    connection.on('disconnecting', () => log('Disconnecting...'));

    return connection;
  },
});

export default registerAs('database', (): DatabaseConfig => {
  const uri = process.env.MONGOOSE_URI;
  if (!uri) {
    throw new Error('MONGOOSE_URI is required in environment variables');
  }

  return {
    uri,
    options: getDatabaseConfig(),
  };
});
