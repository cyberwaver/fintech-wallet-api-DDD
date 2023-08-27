import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class AuthenticationPasswordResetEvent extends DomainEvent {
  public payload: { id: string; passwordHash: string };
  constructor(data: { passwordHash: string }, authenticationId: UniqueEntityID) {
    super(authenticationId);
    this.payload = { id: authenticationId.toString(), passwordHash: data.passwordHash };
  }
}
