import { IsIn, IsNotEmpty } from 'class-validator';

export class ResetPasswordCommand {
  @IsNotEmpty()
  @IsIn(['USER', 'INSTITUTION'])
  type: string;

  @IsNotEmpty()
  token: string;
}
