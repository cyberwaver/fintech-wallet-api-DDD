import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewUserDTO } from '../dto/dtos.index';

export class UserCreatedEvent extends DomainEvent {
  public payload: NewUserDTO & { userId: UniqueEntityID; createdAt: Date };
  constructor(data: NewUserDTO, userId: UniqueEntityID = new UniqueEntityID()) {
    super(userId);
    this.payload = { ...data, userId, createdAt: new Date() };
  }
}
