import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class AuthenticationPasswordResetRequestedEvent extends DomainEvent {
  public payload: { id: string; token: string };
  constructor(token: string, authenticationId: UniqueEntityID) {
    super(authenticationId);
    this.payload = { id: authenticationId.toString(), token };
  }
}
