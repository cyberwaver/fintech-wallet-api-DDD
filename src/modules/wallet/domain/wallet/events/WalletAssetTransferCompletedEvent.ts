import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletId } from '../WalletId';

export class WalletAssetTransferCompletedEvent extends DomainEvent {
  public payload: { walletId: WalletId; transferId: UniqueEntityID };
  constructor(transferId: UniqueEntityID, walletId: WalletId) {
    super(walletId);
    this.payload = { walletId, transferId };
  }
}
