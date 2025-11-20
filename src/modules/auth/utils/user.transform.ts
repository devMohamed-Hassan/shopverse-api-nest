import { UserDocument } from 'src/database/schemas/user.model';
import { UserResponseDto } from '../dto/user-response.dto';

export function transformUserToResponse(
  user: UserDocument | any,
): UserResponseDto {
  const userObject = user.toObject ? user.toObject() : user;
  const { password, emailOtp, passwordOtp, __v, ...userResponse } = userObject;

  return userResponse as UserResponseDto;
}
