import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, userSchema } from 'src/database/schemas/user.model';
import { JwtService } from '@nestjs/jwt';
import { Otp, otpSchema } from 'src/database/schemas/otp.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Otp.name, schema: otpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
