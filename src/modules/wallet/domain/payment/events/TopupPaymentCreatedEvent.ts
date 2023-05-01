import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewTopupPaymentRequestDTO } from '../DTOs/dtos.index';

export class TopupPaymentCreatedEvent extends DomainEvent {
  public payload: TopupPaymentCreatedEventPayload;
  constructor(data: NewTopupPaymentRequestDTO, paymentId: UniqueEntityID) {
    super(paymentId);
    this.payload = { ...data, paymentId: paymentId.toString() };
  }
}

class TopupPaymentCreatedEventPayload extends NewTopupPaymentRequestDTO {
  paymentId: string;
}
