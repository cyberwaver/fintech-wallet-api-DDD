import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class UserDeactivatedEvent extends DomainEvent {
  public payload: { userId: UniqueEntityID };
  constructor(userId: UniqueEntityID) {
    super(userId);
    this.payload = { userId };
  }
}
