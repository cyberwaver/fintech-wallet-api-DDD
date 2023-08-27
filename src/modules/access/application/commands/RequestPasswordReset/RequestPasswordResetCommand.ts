import { IsEmail } from 'class-validator';
import { AuthenticationType } from 'src/modules/access/domain/authentication/AuthenticationType';

export class RequestPasswordResetCommand {
  type: string;
  @IsEmail()
  email: string;
}
