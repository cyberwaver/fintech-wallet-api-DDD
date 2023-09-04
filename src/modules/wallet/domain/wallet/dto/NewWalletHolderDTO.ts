import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { IsNotEmpty } from 'class-validator';
import { WalletId } from '../WalletId';

export class NewWalletHolderDTO {
  @IsNotEmpty()
  walletId: WalletId;
  @IsNotEmpty()
  accountId: UniqueEntityID;
}
