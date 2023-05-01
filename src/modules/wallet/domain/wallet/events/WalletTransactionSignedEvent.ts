import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { SignTransactionRequestDTO } from '../DTOs/dtos.index';

export class WalletTransactionSignedEvent extends DomainEvent {
  public payload: SignTransactionRequestDTO;
  constructor(data: SignTransactionRequestDTO) {
    super(data.walletId);
    this.payload = data;
  }
}
