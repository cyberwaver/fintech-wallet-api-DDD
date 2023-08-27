import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class GenerateAuthTokensCommand {
  @IsNotEmpty()
  @IsIn(['USER', 'INSTITUTION'])
  type: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
