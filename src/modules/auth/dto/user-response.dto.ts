import { RoleEnum, GenderEnum, ProviderEnum } from 'src/shared/types/user.types';

export interface UserResponseDto {
  _id: string;
  firstName?: string;
  lastName?: string;
  userName: string;
  email: string;
  confirmEmail?: Date;
  age?: number;
  phone?: string;
  role: RoleEnum;
  gender: GenderEnum;
  provider: ProviderEnum;
  avatar?: string;
  isActive: boolean;
  isBlocked: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  tokens: AuthTokensDto;
}

