import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { NewWalletDTO } from '../dto/dtos.index';
import { WalletId } from '../WalletId';

export class WalletCreatedEvent extends DomainEvent {
  public payload: NewWalletDTO & { walletId: WalletId };
  constructor(data: NewWalletDTO, id = new WalletId()) {
    super(id);
    this.payload = { ...data, walletId: id };
  }
}
