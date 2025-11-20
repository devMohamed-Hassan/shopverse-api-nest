import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';
import { registerSchema, type RegisterDto } from './dto/register.dto';
import { type ResendOtpDto, resendOtpSchema } from './dto/resendOtp.dto';
import {
  type ConfrimEmailDto,
  confrimEmailSchema,
} from './dto/confirmEmail.dto';
import { type LoginDto, loginSchema } from './dto/login.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { forgotPasswordSchema, type ForgotPasswordDto } from './dto/forgotPassword.dto';
import { resetPasswordSchema, type ResetPasswordDto } from './dto/resetPassword.dto';
import { updateProfileSchema, type UpdateProfileDto } from './dto/updateProfile.dto';
import { changePasswordSchema, type ChangePasswordDto } from './dto/changePassword.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('/resend-otp')
  @UsePipes(new ZodValidationPipe(resendOtpSchema))
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this.authService.resendOtp(body);
  }

  @Post('/confirm-email')
  @UsePipes(new ZodValidationPipe(confrimEmailSchema))
  async confirmEmail(@Body() body: ConfrimEmailDto) {
    return await this.authService.confrimEmail(body);
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  profile(@Req() req: { user: any }) {
    return this.authService.profile(req);
  }

  @Post('/refresh-token')
  async refreshToken(@Req() req: { headers: { authorization?: string } }) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return await this.authService.refreshToken(token);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  logout() {
    return this.authService.logout();
  }

  @Post('/forgot-password')
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  @Post('/reset-password')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }

  @Patch('/update-profile')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(updateProfileSchema))
  async updateProfile(@Req() req: { user: any }, @Body() body: UpdateProfileDto) {
    return await this.authService.updateProfile(req.user._id.toString(), body);
  }

  @Patch('/change-password')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(changePasswordSchema))
  async changePassword(@Req() req: { user: any }, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(req.user._id.toString(), body);
  }
}
