import { IsNotEmpty, IsNumber } from 'class-validator';

export class NewWalletTemplateDTO {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  type: string;
}
