import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletTransactionDTO } from '../DTOs/dtos.index';

export class WalletReversalTxnCreatedEvent extends DomainEvent {
  public payload: WalletReversalTxnCreatedEventPayload;
  constructor(data: NewWalletTransactionDTO, transactionId: UniqueEntityID = new UniqueEntityID()) {
    super(data.walletId);
    this.payload = { ...data, transactionId: transactionId.toString() };
  }
}

class WalletReversalTxnCreatedEventPayload extends NewWalletTransactionDTO {
  transactionId: string;
}
