import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { NewWalletTransactionDTO } from "../DTOs/dtos.index";

export class WalletDebitTxnCreatedEvent extends DomainEvent {
  public payload: WalletDebitTxnCreatedPayload;
  constructor(data: NewWalletTransactionDTO, transactionId: UniqueEntityID = new UniqueEntityID()) {
    super(data.walletId);
    this.payload = { ...data, transactionId: transactionId.toString() };
  }
}

class WalletDebitTxnCreatedPayload extends NewWalletTransactionDTO {
  transactionId: string;
}
