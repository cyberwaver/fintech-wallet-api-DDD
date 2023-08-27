import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewBusinessDTO } from '../dto/dtos.index';

export class BusinessCreatedEvent extends DomainEvent {
  public payload: NewBusinessDTO & { businessId: UniqueEntityID; createdAt: Date };
  constructor(data: NewBusinessDTO, businessId: UniqueEntityID = new UniqueEntityID()) {
    super(businessId);
    this.payload = { ...data, businessId, createdAt: new Date() };
  }
}
