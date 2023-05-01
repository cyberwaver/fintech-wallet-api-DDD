import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWithdrawalPaymentRequestDTO } from '../DTOs/dtos.index';

export class WithdrawalPaymentCreatedEvent extends DomainEvent {
  public payload: WithdrawalPaymentCreatedEventPayload;
  constructor(data: NewWithdrawalPaymentRequestDTO, paymentId: UniqueEntityID) {
    super(paymentId);
    this.payload = { ...data, paymentId: paymentId.toString() };
  }
}

class WithdrawalPaymentCreatedEventPayload extends NewWithdrawalPaymentRequestDTO {
  paymentId: string;
}
