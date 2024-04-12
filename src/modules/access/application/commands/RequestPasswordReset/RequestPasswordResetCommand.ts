import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetCommand {
  @IsNotEmpty()
  @IsIn(['USER', 'INSTITUTION'])
  type: string;

  @IsEmail()
  email: string;
}
