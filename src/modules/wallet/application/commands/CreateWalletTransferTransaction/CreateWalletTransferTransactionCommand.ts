import { IsNotEmpty } from 'class-validator';

export class CreateWalletTransferTransactionCommand {
  @IsNotEmpty()
  fromWalletId: string;

  @IsNotEmpty()
  toWalletId: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  initiatorId: string;

  @IsNotEmpty()
  description: string;
}
