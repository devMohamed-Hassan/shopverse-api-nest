import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.model';
import { verifyJwt } from '../utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const payload = verifyJwt(token, this.configService, 'access');
      const user = await this.userModel.findOne({ _id: payload.userId });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.confirmEmail) {
        throw new UnauthorizedException('Please confirm your email');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Your account has been deactivated');
      }

      if (user.isBlocked) {
        throw new UnauthorizedException('Your account has been blocked');
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
