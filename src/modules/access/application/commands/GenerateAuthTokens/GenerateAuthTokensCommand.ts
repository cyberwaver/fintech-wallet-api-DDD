import { AuthenticationType } from '@Access/domain/authentication/AuthenticationType';
import { Transform, Type } from 'class-transformer';
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
