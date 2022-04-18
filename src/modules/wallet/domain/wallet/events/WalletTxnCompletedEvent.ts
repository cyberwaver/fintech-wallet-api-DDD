import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { CompleteTransactionRequestDTO } from "../DTOs/dtos.index";

export class WalletTxnCompletedEvent extends DomainEvent {
  public payload: WalletTxnCompletedEventPayload;
  constructor(data: CompleteTransactionRequestDTO) {
    super(data.walletId);
    this.payload = data;
  }
}

class WalletTxnCompletedEventPayload extends CompleteTransactionRequestDTO {}
