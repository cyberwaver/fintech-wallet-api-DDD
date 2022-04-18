import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { NewWalletTransactionDTO } from "../DTOs/dtos.index";

export class WalletCreditTxnCreatedEvent extends DomainEvent {
  public payload: WalletCreditTxnCreatedEventPayload;
  constructor(data: NewWalletTransactionDTO, transactionId: UniqueEntityID = new UniqueEntityID()) {
    super(data.walletId);
    this.payload = { ...data, transactionId: transactionId.toString() };
  }
}

class WalletCreditTxnCreatedEventPayload extends NewWalletTransactionDTO {
  transactionId: string;
}
