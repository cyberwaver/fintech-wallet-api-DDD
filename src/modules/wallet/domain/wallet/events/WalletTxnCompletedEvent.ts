import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { CompleteTransactionRequestDTO } from '../DTOs/dtos.index';

export class WalletTxnCompletedEvent extends DomainEvent {
  public payload: WalletTxnCompletedEventPayload;
  constructor(data: CompleteTransactionRequestDTO) {
    super(data.walletId);
    this.payload = data;
  }
}

class WalletTxnCompletedEventPayload extends CompleteTransactionRequestDTO {}
