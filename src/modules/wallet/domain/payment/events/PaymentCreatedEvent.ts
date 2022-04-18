import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { PaymentDTO } from "../DTOs/PaymentDTO";
import { Payment } from "../Payment";

export class PaymentCreatedEvent extends DomainEvent {
  public payload: PaymentDTO;
  constructor(payment: Payment) {}
}
