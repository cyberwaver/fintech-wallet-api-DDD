import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordResetRequestDTO {
  @IsNotEmpty()
  type: string;

  @IsEmail()
  email: string;

  token?: string;
}
