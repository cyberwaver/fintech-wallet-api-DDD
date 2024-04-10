import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { NewAuthenticationDTO } from '../dto/dtos.index';
import { AuthenticationId } from '../AuthenticationId';

export class AuthenticationCreatedEvent extends DomainEvent {
  public payload: AuthenticationCreatedEventPayload;
  constructor(data: NewAuthenticationDTO, authenticationId = new AuthenticationId()) {
    super(authenticationId);
    this.payload = { ...data, id: authenticationId };
  }
}

class AuthenticationCreatedEventPayload extends NewAuthenticationDTO {
  id: AuthenticationId;
}
