import { IsNotEmpty } from 'class-validator';

export class RequestWalletBalanceTransferCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  initiatorId: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  note: string;
}
