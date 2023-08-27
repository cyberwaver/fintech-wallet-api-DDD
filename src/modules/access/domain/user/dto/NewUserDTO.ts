import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewUserDTO {
  @IsNotEmpty()
  authId: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
