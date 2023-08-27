import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWalletTemplateDTO {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  type: string;
}
