import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { NewWalletDTO } from "../DTOs/dtos.index";

export class WalletCreatedEvent extends DomainEvent {
  public payload: WalletCreatedEventPayload;
  constructor(data: NewWalletDTO, id: UniqueEntityID = new UniqueEntityID()) {
    super(id);
    this.payload = { ...data, walletId: id.toString() };
  }
}

class WalletCreatedEventPayload extends NewWalletDTO {
  walletId: string;
}
