import { plainToInstance } from 'class-transformer';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletHolderDTO, WalletHolderDTO } from './DTOs/dtos.index';
import { WalletHolderStatus } from './WalletHolderStatus';

class WalletHolderProps {
  id: UniqueEntityID;
  walletId: string;
  accountId: string;
  status: WalletHolderStatus;
  isCreator: boolean;
  createdAt: string;
}

export class WalletHolder extends Entity<WalletHolderProps> {
  constructor(dto: WalletHolderDTO) {
    super(dto, WalletHolderProps);
  }

  public static create(data: NewWalletHolderDTO): WalletHolder {
    return plainToInstance(WalletHolder, data);
  }
}
