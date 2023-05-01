import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletTransactionDTO } from '../DTOs/dtos.index';

export class WalletSettlementTxnCreatedEvent extends DomainEvent {
  public payload: WalletSettlementTxnCreatedEventPayload;
  constructor(data: NewWalletTransactionDTO, transactionId: UniqueEntityID = new UniqueEntityID()) {
    super(data.walletId);
    this.payload = { ...data, transactionId: transactionId.toString() };
  }
}

class WalletSettlementTxnCreatedEventPayload extends NewWalletTransactionDTO {
  transactionId: string;
}
