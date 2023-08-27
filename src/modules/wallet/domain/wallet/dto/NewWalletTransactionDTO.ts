import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { WalletTransactionType } from '../WalletTransactionType';
import { WalletTransactionClass } from '../WalletTransactionClass';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Amount } from 'src/common/domain/Amount';

export class NewWalletTransactionDTO {
  @IsNotEmpty()
  @Type(() => WalletTransactionClass)
  class: WalletTransactionClass;

  @IsNotEmpty()
  @Type(() => WalletTransactionType)
  type: WalletTransactionType;

  @IsNotEmpty()
  @Type(() => Amount)
  amount: Amount;

  @IsNotEmpty()
  @Type(() => UniqueEntityID)
  holderId: UniqueEntityID;

  @IsNotEmpty()
  description: string;

  @Type(() => UniqueEntityID)
  originalTxnId: UniqueEntityID;
}
