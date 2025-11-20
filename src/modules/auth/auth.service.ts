import { UserDocument, UserModel } from '../../database/schemas/user.model';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/user.model';
import { type RegisterDto } from './dto/register.dto';
import { createOtp } from 'src/common/utils/create.otp';
import { sendEmail } from 'src/common/utils/sendEmail/send.email';
import { template } from 'src/common/utils/sendEmail/emailTemplate';
import { OtpTypeEnum } from 'src/shared/types/user.types';
import { Otp, OtpDocument } from 'src/database/schemas/otp.model';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { ConfrimEmailDto } from './dto/confirmEmail.dto';
import { compare, hash } from 'src/common/utils/security/hash.utils';
import { LoginDto } from './dto/login.dto';
import { createJwt, verifyJwt } from 'src/common/utils/jwt';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UserDocument as IUserDocument } from 'src/database/schemas/user.model';
import { transformUserToResponse } from './utils/user.transform';
import { UserResponseDto, AuthTokensDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private configService: ConfigService,
  ) {}

  async register(body: RegisterDto) {
    const { firstName, email, userName } = body;
    const checkUserByEmail = await this.userModel.findOne({ email });
    if (checkUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    if (userName) {
      const checkUserByUserName = await this.userModel.findOne({ userName });
      if (checkUserByUserName) {
        throw new ConflictException('Username is already taken');
      }
    }
    const otpCode = createOtp();
    const { isEmailSended } = await sendEmail(this.configService, {
      to: email,
      subject: 'Shopverse - Email Verification',
      html: template({
        otpCode,
        receiverName: firstName || '',
        subject: OtpTypeEnum.CONFIRMEMAIL,
      }),
    });
    if (!isEmailSended) {
      throw new BadRequestException('Error while sending verification email');
    }

    const user = await this.userModel.create(body);
    await this.otpModel.create({
      code: otpCode,
      expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      createdBy: user._id,
      type: OtpTypeEnum.CONFIRMEMAIL,
    });

    return {
      message: 'User registered successfully. Please verify your email to complete registration.',
      result: {
        email: user.email,
        expiresIn: '10 minutes',
      },
    };
  }

  async resendOtp(body: ResendOtpDto) {
    const { email, otpType } = body;
    const query: { email: string; confirmEmail?: { $exists: boolean } } = { email };
    const otpTypeValue = otpType as OtpTypeEnum;
    if (otpTypeValue === OtpTypeEnum.CONFIRMEMAIL) {
      query.confirmEmail = { $exists: false };
    } else if (otpTypeValue === OtpTypeEnum.RESETPASSWORD) {
      query.confirmEmail = { $exists: true };
    }

    const checkUser = await this.userModel.findOne(query);
    if (!checkUser) {
      throw new NotFoundException('User not found');
    }

    const activeOtp = await this.otpModel.findOne({
      createdBy: checkUser._id,
      type: otpType,
      expiredAt: { $gt: new Date() },
    });
    if (activeOtp) {
      throw new BadRequestException('Please wait before requesting a new OTP');
    }

    const otpCode = createOtp();
    const { isEmailSended } = await sendEmail(this.configService, {
      to: email,
      subject: 'Shopverse - OTP Verification',
      html: template({
        otpCode,
        receiverName: checkUser.firstName || '',
        subject: otpType,
      }),
    });
    if (!isEmailSended) {
      throw new BadRequestException('Error while sending email');
    }

    await this.otpModel.create({
      code: otpCode,
      expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      createdBy: checkUser._id,
      type: otpType,
    });
    return { message: 'OTP sent to email successfully' };
  }

  async confrimEmail(body: ConfrimEmailDto) {
    const { email, otp } = body;
    const checkUser = await this.userModel.findOne({
      email,
      confirmEmail: { $exists: false },
    });
    if (!checkUser) {
      throw new NotFoundException('User not found or email already confirmed');
    }

    const checkOtp = await this.otpModel.findOne({
      createdBy: checkUser._id,
      type: OtpTypeEnum.CONFIRMEMAIL,
      expiredAt: { $gt: new Date() },
    });
    if (!checkOtp) {
      throw new BadRequestException('OTP not found or expired');
    }

    const isValidOtp = await compare(otp, checkOtp.code);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpModel.deleteOne({ _id: checkOtp._id });

    const confirmedUser = await this.userModel.findOneAndUpdate(
      { email },
      { 
        $set: { 
          confirmEmail: new Date(),
          lastLogin: new Date(),
        } 
      },
      { new: true },
    );

    if (!confirmedUser) {
      throw new NotFoundException('User not found after email confirmation');
    }

    const accessToken = createJwt(
      { userId: confirmedUser._id.toString(), userEmail: confirmedUser.email },
      this.configService,
      'access',
    );
    const refreshToken = createJwt(
      { userId: confirmedUser._id.toString(), userEmail: confirmedUser.email },
      this.configService,
      'refresh',
    );

    const userResponse = transformUserToResponse(confirmedUser);
    const tokens: AuthTokensDto = { accessToken, refreshToken };

    return {
      message: 'Email confirmed successfully. You can now access your account.',
      result: {
        user: userResponse,
        tokens,
      },
    };
  }

  async login(body: LoginDto) {
    const { email, password } = body;
    const checkUser = await this.userModel.findOne({ email });
    if (!checkUser) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!checkUser.confirmEmail) {
      throw new BadRequestException(
        'Please confirm your email before logging in',
      );
    }

    if (!checkUser.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    if (checkUser.isBlocked) {
      throw new UnauthorizedException('Your account has been blocked. Please contact support.');
    }

    const isPasswordValid = await compare(password, checkUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    await this.userModel.updateOne(
      { _id: checkUser._id },
      { $set: { lastLogin: new Date() } },
    );

    const accessToken = createJwt(
      { userId: checkUser._id.toString(), userEmail: checkUser.email },
      this.configService,
      'access',
    );
    const refreshToken = createJwt(
      { userId: checkUser._id.toString(), userEmail: checkUser.email },
      this.configService,
      'refresh',
    );

    const userResponse = transformUserToResponse(checkUser);
    const tokens: AuthTokensDto = { accessToken, refreshToken };

    return {
      message: 'Login successful',
      result: {
        user: userResponse,
        tokens,
      },
    };
  }

  profile(req: { user: IUserDocument }) {
    const user = req.user;
    const userResponse = transformUserToResponse(user);
    return {
      message: 'Profile retrieved successfully',
      result: { user: userResponse },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = verifyJwt(refreshToken, this.configService, 'refresh');
      const user = await this.userModel.findOne({ _id: payload.userId });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.confirmEmail) {
        throw new UnauthorizedException('Email not confirmed');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Your account has been deactivated');
      }

      if (user.isBlocked) {
        throw new UnauthorizedException('Your account has been blocked');
      }

      const newAccessToken = createJwt(
        { userId: user._id.toString(), userEmail: user.email },
        this.configService,
        'access',
      );
      const newRefreshToken = createJwt(
        { userId: user._id.toString(), userEmail: user.email },
        this.configService,
        'refresh',
      );

      const tokens: AuthTokensDto = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      return {
        message: 'Token refreshed successfully',
        result: tokens,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const { email } = body;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { message: 'If the email exists, a password reset OTP has been sent' };
    }

    if (!user.confirmEmail) {
      throw new BadRequestException('Please confirm your email first');
    }

    const activeOtp = await this.otpModel.findOne({
      createdBy: user._id,
      type: OtpTypeEnum.RESETPASSWORD,
      expiredAt: { $gt: new Date() },
    });
    if (activeOtp) {
      throw new BadRequestException('Please wait before requesting a new OTP');
    }

    const otpCode = createOtp();
    const { isEmailSended } = await sendEmail(this.configService, {
      to: email,
      subject: 'Shopverse - Password Reset',
      html: template({
        otpCode,
        receiverName: user.firstName || '',
        subject: OtpTypeEnum.RESETPASSWORD,
      }),
    });

    if (!isEmailSended) {
      throw new BadRequestException('Error while sending email');
    }

    await this.otpModel.create({
      code: otpCode,
      expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      createdBy: user._id,
      type: OtpTypeEnum.RESETPASSWORD,
    });

    return { message: 'If the email exists, a password reset OTP has been sent' };
  }

  async resetPassword(body: ResetPasswordDto) {
    const { email, otp, newPassword } = body;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const checkOtp = await this.otpModel.findOne({
      createdBy: user._id,
      type: OtpTypeEnum.RESETPASSWORD,
      expiredAt: { $gt: new Date() },
    });

    if (!checkOtp) {
      throw new BadRequestException('OTP not found or expired');
    }

    const isValidOtp = await compare(otp, checkOtp.code);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    const hashedPassword = await hash(newPassword, this.configService);
    await this.userModel.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          credentialsChangedAt: new Date(),
        },
      },
    );

    await this.otpModel.deleteOne({ _id: checkOtp._id });

    return { message: 'Password reset successfully' };
  }

  async updateProfile(userId: string, body: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (body.userName && body.userName !== user.userName) {
      const existingUser = await this.userModel.findOne({
        userName: body.userName,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ConflictException('Username is already taken');
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    const userResponse = transformUserToResponse(updatedUser);

    return {
      message: 'Profile updated successfully',
      result: { user: userResponse },
    };
  }

  async changePassword(userId: string, body: ChangePasswordDto) {
    const { currentPassword, newPassword } = body;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await hash(newPassword, this.configService);
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          credentialsChangedAt: new Date(),
        },
      },
    );

    return { message: 'Password changed successfully' };
  }

  logout() {
    return { message: 'Logged out successfully' };
  }
}
