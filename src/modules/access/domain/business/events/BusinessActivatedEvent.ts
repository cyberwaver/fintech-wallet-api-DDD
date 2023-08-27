import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class BusinessActivatedEvent extends DomainEvent {
  public payload: { businessId: UniqueEntityID };
  constructor(businessId: UniqueEntityID) {
    super(businessId);
    this.payload = { businessId };
  }
}
