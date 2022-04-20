import { AggregateRoot } from "src/shared/domain/AggregateRoot";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import {
  NewTransferPaymentRequestDTO,
  NewTopupPaymentRequestDTO,
  NewWithdrawalPaymentRequestDTO,
} from "./DTOs/dtos.index";
import {
  TopupPaymentCreatedEvent,
  TransferPaymentCreatedEvent,
  WithdrawalPaymentCreatedEvent,
} from "./events/events.index";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentType } from "./PaymentType";

class PaymentProps {
  id: UniqueEntityID;
  walletId: UniqueEntityID;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
  processedAt: Date;
  meta: object;
}

export class Payment extends AggregateRoot<PaymentProps> {
  public readonly type = this.props.type;
  constructor(dto?: object) {
    super(dto, PaymentProps);
  }

  static async CreateTransfer(request: NewTransferPaymentRequestDTO): Promise<Payment> {
    const payment = new Payment();
    payment.apply(new TransferPaymentCreatedEvent(request, payment.ID));
    return payment;
  }

  static async CreateTopup(request: NewTopupPaymentRequestDTO): Promise<Payment> {
    const payment = new Payment();
    payment.apply(new TopupPaymentCreatedEvent(request, payment.ID));
    return payment;
  }

  static async CreateWithdrawal(request: NewWithdrawalPaymentRequestDTO): Promise<Payment> {
    const payment = new Payment();
    payment.apply(new WithdrawalPaymentCreatedEvent(request, payment.ID));
    return payment;
  }

  private $whenTransferPaymentCreatedEvent($event: TransferPaymentCreatedEvent) {
    this.props.type = PaymentType.Transfer;
    this.props.walletId = new UniqueEntityID($event.payload.fromWalletId);
    this.props.amount = $event.payload.amount;
    this.props.status = PaymentStatus.Pending;
    this.props.meta = {
      toWalletId: new UniqueEntityID($event.payload.toWalletId),
    };
  }

  private $whenTopupPaymentCreatedEvent($event: TopupPaymentCreatedEvent) {
    this.props.type = PaymentType.Transfer;
    this.props.walletId = new UniqueEntityID($event.payload.walletId);
    this.props.amount = $event.payload.amount;
    this.props.status = PaymentStatus.Pending;
  }

  private $whenWithdrawalPaymentCreatedEvent($event: WithdrawalPaymentCreatedEvent) {
    this.props.type = PaymentType.Transfer;
    this.props.walletId = new UniqueEntityID($event.payload.walletId);
    this.props.amount = $event.payload.amount;
    this.props.status = PaymentStatus.Pending;
    this.props.meta = {
      bankName: $event.payload.bankName,
      bankAccountName: $event.payload.bankAccountName,
      bankAccountNumber: $event.payload.bankAccountNumber,
    };
  }
}
