import { JwtPayload, Secret, sign, SignOptions, verify } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../../config';
import { IUserPayload } from '../../shared/interfaces';

export interface MyJwtPayload extends IUserPayload {
  iat: number;
  exp: number;
  jti: string;
}

export const createJwt = (
  payload: IUserPayload,
  configService: ConfigService,
  tokenType: 'access' | 'refresh' = 'access',
): string => {
  const jwtConfig = configService.get<JwtConfig>('jwt');
  if (!jwtConfig) {
    throw new Error('JWT configuration is missing');
  }

  const privateKey =
    tokenType === 'access'
      ? jwtConfig.accessTokenSecret
      : jwtConfig.refreshTokenSecret;
  const expiresIn =
    tokenType === 'access'
      ? jwtConfig.accessTokenExpiresIn
      : jwtConfig.refreshTokenExpiresIn;

  const options: SignOptions = {
    expiresIn: expiresIn as StringValue,
  };

  return sign(payload, privateKey, options);
};

export const verifyJwt = (
  token: string,
  configService: ConfigService,
  tokenType: 'access' | 'refresh' = 'access',
): MyJwtPayload => {
  const jwtConfig = configService.get<JwtConfig>('jwt');
  if (!jwtConfig) {
    throw new Error('JWT configuration is missing');
  }

  const privateKey =
    tokenType === 'access'
      ? jwtConfig.accessTokenSecret
      : jwtConfig.refreshTokenSecret;

  const payload = verify(token, privateKey) as MyJwtPayload;
  return payload;
};

export const createJwtLegacy = (
  payload: string | object,
  privateKey: Secret,
  options?: SignOptions,
): string => {
  return sign(payload, privateKey, options);
};

export const verifyJwtLegacy = ({
  token,
  privateKey,
}: {
  token: string;
  privateKey: Secret;
}): MyJwtPayload => {
  const payload = verify(token, privateKey) as MyJwtPayload;
  return payload;
};
