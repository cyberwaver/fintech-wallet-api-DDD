import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewBusinessDTO {
  @IsNotEmpty()
  authId: string;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  abbr?: string;
  keyPrefix?: string;
}
