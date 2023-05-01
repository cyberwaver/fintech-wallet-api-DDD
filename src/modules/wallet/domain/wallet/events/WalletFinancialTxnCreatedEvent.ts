import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletTransactionDTO } from '../DTOs/dtos.index';

export class WalletFinancialTxnCreatedEvent extends DomainEvent {
  public payload: WalletFinancialTxnCreatedEventPayload;
  constructor(data: NewWalletTransactionDTO, transactionId: UniqueEntityID = new UniqueEntityID()) {
    super(data.walletId);
    this.payload = { ...data, transactionId: transactionId.toString() };
  }
}

class WalletFinancialTxnCreatedEventPayload extends NewWalletTransactionDTO {
  transactionId: string;
}
