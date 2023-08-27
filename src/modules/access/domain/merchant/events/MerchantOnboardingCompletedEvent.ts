import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class MerchantOnboardingCompletedEvent extends DomainEvent {
  public payload: { merchantId: UniqueEntityID; onboardedAt: Date };
  constructor(merchantId: UniqueEntityID) {
    super(merchantId);
    this.payload = { merchantId, onboardedAt: new Date() };
  }
}
