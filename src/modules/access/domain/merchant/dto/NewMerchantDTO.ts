import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewMerchantDTO {
  @IsNotEmpty()
  authId: string;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  currencyCode: string;

  abbr?: string;
  keyPrefix?: string;
}
