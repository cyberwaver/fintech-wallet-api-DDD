import { IsEmail, IsIn, IsNotEmpty, Min } from 'class-validator';

export default class CreateAuthenticationRequestDTO {
  @IsNotEmpty()
  @IsIn(['USER', 'INSTITUTION'])
  type: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @Min(6, { message: 'Password length should be minimum of 6' })
  @IsNotEmpty()
  password: string;

  passwordHash: string;
}
