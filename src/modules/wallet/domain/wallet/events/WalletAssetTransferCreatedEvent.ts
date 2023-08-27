import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletAssetTransferDTO } from '../dto/dtos.index';
import { WalletId } from '../WalletId';

export class WalletAssetTransferCreatedEvent extends DomainEvent {
  public payload: NewWalletAssetTransferDTO & { transferId: UniqueEntityID; walletId: WalletId };
  constructor(data: NewWalletAssetTransferDTO, transferId: UniqueEntityID, walletId: WalletId) {
    super(walletId);
    this.payload = { ...data, walletId, transferId };
  }
}
