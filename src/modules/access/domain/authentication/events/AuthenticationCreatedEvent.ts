import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewAuthenticationDTO } from '../dto/dtos.index';

export class AuthenticationCreatedEvent extends DomainEvent {
  public payload: AuthenticationCreatedEventPayload;
  constructor(data: NewAuthenticationDTO, authenticationId: UniqueEntityID = new UniqueEntityID()) {
    super(authenticationId);
    this.payload = { ...data, id: authenticationId.toString() };
  }
}

class AuthenticationCreatedEventPayload extends NewAuthenticationDTO {
  id: string;
}
