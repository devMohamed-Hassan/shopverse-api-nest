import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        
        if (!dbConfig?.uri) {
          console.error('\n❌ MONGOOSE_URI is not defined!\n');
          console.error('Please create a .env file in the root directory with:');
          console.error('MONGOOSE_URI=mongodb://localhost:27017/shopverse\n');
          throw new Error(
            'MONGOOSE_URI is not defined. Create a .env file or set the environment variable.',
          );
        }
        
        const maskedUri = dbConfig.uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.log(`Database URI loaded: ${maskedUri}`);
        
        return {
          uri: dbConfig.uri,
          ...dbConfig.options,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

