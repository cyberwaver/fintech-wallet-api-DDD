import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import {
  NewTransferPaymentRequestDTO,
  NewTopupPaymentRequestDTO,
  NewWithdrawalPaymentRequestDTO,
} from './DTOs/dtos.index';
import {
  TopupPaymentCreatedEvent,
  TransferPaymentCreatedEvent,
  WithdrawalPaymentCreatedEvent,
} from './events/events.index';
import { PaymentStatus } from './PaymentStatus';
import { PaymentType } from './PaymentType';

export class PaymentProps {
  id: UniqueEntityID;
  walletId: UniqueEntityID;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
  processedAt: Date;
  meta: Record<string, unknown>;
}

export class Payment extends AggregateRoot<PaymentProps> {
  public readonly type = this.state.type;
  constructor(props?: PaymentProps) {
    super(props);
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

  private $onTransferPaymentCreatedEvent($event: TransferPaymentCreatedEvent) {
    this.state.type = PaymentType.Transfer;
    this.state.walletId = new UniqueEntityID($event.payload.fromWalletId);
    this.state.amount = $event.payload.amount;
    this.state.status = PaymentStatus.Pending;
    this.state.meta = {
      toWalletId: new UniqueEntityID($event.payload.toWalletId),
    };
  }

  private $onTopupPaymentCreatedEvent($event: TopupPaymentCreatedEvent) {
    this.state.type = PaymentType.Transfer;
    this.state.walletId = new UniqueEntityID($event.payload.walletId);
    this.state.amount = $event.payload.amount;
    this.state.status = PaymentStatus.Pending;
  }

  private $onWithdrawalPaymentCreatedEvent($event: WithdrawalPaymentCreatedEvent) {
    this.state.type = PaymentType.Transfer;
    this.state.walletId = new UniqueEntityID($event.payload.walletId);
    this.state.amount = $event.payload.amount;
    this.state.status = PaymentStatus.Pending;
    this.state.meta = {
      bankName: $event.payload.bankName,
      bankAccountName: $event.payload.bankAccountName,
      bankAccountNumber: $event.payload.bankAccountNumber,
    };
  }
}
