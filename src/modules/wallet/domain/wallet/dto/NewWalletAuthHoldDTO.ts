import { Amount } from '@Common/domain/Amount';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class NewWalletAuthHoldDTO {
  @IsNotEmpty()
  @Type(() => UniqueEntityID)
  authTxnId: UniqueEntityID;

  @IsNotEmpty()
  @Type(() => Amount)
  amount: Amount;

  period: number;
}
