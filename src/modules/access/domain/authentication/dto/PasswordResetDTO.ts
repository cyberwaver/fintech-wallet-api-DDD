import { IsNotEmpty } from 'class-validator';

export class PasswordResetDTO {
  @IsNotEmpty()
  password: string;

  passwordHash: string;
}
