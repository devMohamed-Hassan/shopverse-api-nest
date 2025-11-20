import { RoleEnum, GenderEnum, ProviderEnum, OtpTypeEnum } from '../types/user.types';

export interface IUser {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  confirmEmail: Date;
  password: string;
  age: number;
  phone: string;
  role: RoleEnum;
  gender: GenderEnum;
  provider: ProviderEnum;
  credentialsChangedAt: Date;
  emailOtp: IOtp;
  passwordOtp: IOtp;
}

export interface IOtp {
  otp: string;
  expiredAt: Date;
}

export interface IUserPayload {
  userId: string;
  userEmail: string;
}

