import { IsNotEmpty } from 'class-validator';

export class CreateWalletDepositTransactionCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  holderId: string;

  @IsNotEmpty()
  description: string;
}
