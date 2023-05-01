import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewTransferPaymentRequestDTO } from '../DTOs/dtos.index';

export class TransferPaymentCreatedEvent extends DomainEvent {
  public payload: TransferPaymentCreatedEventPayload;
  constructor(data: NewTransferPaymentRequestDTO, paymentId: UniqueEntityID) {
    super(paymentId);
    this.payload = { ...data, paymentId: paymentId.toString() };
  }
}

class TransferPaymentCreatedEventPayload extends NewTransferPaymentRequestDTO {
  paymentId: string;
}
