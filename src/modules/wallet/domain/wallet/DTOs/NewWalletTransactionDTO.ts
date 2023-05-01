import { IsIn, IsNotEmpty } from 'class-validator';

export class NewWalletTransactionDTO {
  @IsNotEmpty()
  @IsIn(['AUTHORIZATION', 'FINANCIAL', 'SETTLEMENT', 'REVERSAL'])
  type: string;

  @IsNotEmpty()
  walletId: string;

  @IsIn(['CREDIT', 'DEBIT'])
  action: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  holderId: string;

  @IsNotEmpty()
  description: string;

  referenceTxnId: string;
}
