import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { UpdateWalletTemplateDTO } from '../DTOs/dtos.index';

export class WalletTemplateUpdatedEvent extends DomainEvent {
  public payload: UpdateWalletTemplateDTO & { id: UniqueEntityID };
  constructor(data: UpdateWalletTemplateDTO, id = new UniqueEntityID()) {
    super(id);
    this.payload = { ...data, id };
  }
}
