import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { NewUserDTO } from '../dto/dtos.index';
import { UserId } from '../UserId';

export class UserCreatedEvent extends DomainEvent {
  public payload: NewUserDTO & { id: UserId; createdAt: Date };
  constructor(data: NewUserDTO, id = new UserId()) {
    super(id);
    this.payload = { ...data, id, createdAt: new Date() };
  }
}
