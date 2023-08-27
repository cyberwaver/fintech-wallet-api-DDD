import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';

export class MerchantDeactivatedEvent extends DomainEvent {
  public payload: { merchantId: UniqueEntityID };
  constructor(merchantId: UniqueEntityID) {
    super(merchantId);
    this.payload = { merchantId };
  }
}
