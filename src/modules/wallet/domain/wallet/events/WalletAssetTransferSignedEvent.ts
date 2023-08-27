import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletId } from '../WalletId';

export class WalletAssetTransferSignedEvent extends DomainEvent {
  public payload: { transferId: UniqueEntityID; holderId: UniqueEntityID; walletId: WalletId };
  constructor(transferId: UniqueEntityID, holderId: UniqueEntityID, walletId: WalletId) {
    super(walletId);
    this.payload = { transferId, holderId, walletId };
  }
}
