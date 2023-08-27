import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class UserOnboardingCompletionInitiatedEvent extends DomainEvent {
  public payload: { userId: UniqueEntityID; onboardedAt: Date };
  constructor(userId: UniqueEntityID) {
    super(userId);
    this.payload = { userId, onboardedAt: new Date() };
  }
}
