import { IsNotEmpty } from 'class-validator';

export class NewWalletLienDTO {
  @IsNotEmpty()
  walletId: string;
  @IsNotEmpty()
  txnId: string;
  status: string;
  @IsNotEmpty()
  amount: number;
  expireAt: Date;
}
