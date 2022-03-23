import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { PaymentDTO } from "../DTOs/PaymentDTO";
import { Payment } from "../Payment";

export class PaymentCreatedEvent extends DomainEvent {
    public payment: PaymentDTO
    constructor(payment: Payment) {
        super(payment.ID);
        this.payment = payment.toDTO();
    }
}