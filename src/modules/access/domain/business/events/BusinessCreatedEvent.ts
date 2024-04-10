import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { NewBusinessDTO } from '../dto/dtos.index';
import { BusinessId } from '../BusinessId';

export class BusinessCreatedEvent extends DomainEvent {
  public payload: NewBusinessDTO & { id: BusinessId; createdAt: Date };
  constructor(data: NewBusinessDTO, id = new BusinessId()) {
    super(id);
    this.payload = { ...data, id, createdAt: new Date() };
  }
}
