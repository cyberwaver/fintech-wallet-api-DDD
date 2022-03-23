import { plainToInstance } from "class-transformer";
import { AggregateRoot } from "src/shared/domain/AggregateRoot";
import { NewPaymentDTO, PaymentDTO } from "./DTOs/index.dtos";
import { PaymentCreatedEvent } from "./events/PaymentCreatedEvent";
import { PaymentType } from "./PaymentType";

export class Payment extends AggregateRoot<PaymentDTO> {
    private amount: number;
    private type: PaymentType;
    private createdAt: Date;
    private meta: object;

    constructor(props: PaymentDTO) {
        super(props.id, PaymentDTO);
        this.amount = props.amount;
        this.type = new PaymentType(props.type);
        this.createdAt = props.createdAt || new Date();
        this.meta = props.meta;
    }

    static async Create(txnData: NewPaymentDTO): Promise<Payment> {
        const payment = new Payment(plainToInstance(PaymentDTO, txnData));
        payment.addDomainEvent(PaymentCreatedEvent);
        return payment;
    }
}