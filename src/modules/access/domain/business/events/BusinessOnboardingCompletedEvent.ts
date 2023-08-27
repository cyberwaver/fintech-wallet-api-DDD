import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class BusinessOnboardingCompletedEvent extends DomainEvent {
  public payload: { businessId: UniqueEntityID; onboardedAt: Date };
  constructor(businessId: UniqueEntityID) {
    super(businessId);
    this.payload = { businessId, onboardedAt: new Date() };
  }
}
