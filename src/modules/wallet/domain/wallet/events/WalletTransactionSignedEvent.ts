import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { SignTransactionRequestDTO } from "../DTOs/dtos.index";

export class WalletTransactionSignedEvent extends DomainEvent {
  public payload: SignTransactionRequestDTO;
  constructor(data: SignTransactionRequestDTO) {
    super(data.walletId);
    this.payload = data;
  }
}
