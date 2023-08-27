import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletTemplateDTO } from '../DTOs/dtos.index';

export class WalletTemplatedCreatedEvent extends DomainEvent {
  public payload: NewWalletTemplateDTO & { id: UniqueEntityID };
  constructor(data: NewWalletTemplateDTO, id = new UniqueEntityID()) {
    super(id);
    this.payload = { ...data, id };
  }
}
