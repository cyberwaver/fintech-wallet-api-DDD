import { IsNotEmpty, IsNumber } from 'class-validator';

export class NewBankAccountDTO {
  @IsNotEmpty()
  accountName: string;

  @IsNotEmpty()
  @IsNumber()
  accountNo: string;

  @IsNotEmpty()
  bankName: string;

  @IsNotEmpty()
  @IsNumber()
  bankCode: string;

  isDefault?: boolean;
}
