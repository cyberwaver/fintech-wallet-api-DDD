import { plainToInstance, Type } from "class-transformer";
import { AggregateRoot } from "src/shared/domain/AggregateRoot";
import {
  NewWalletDTO,
  NewWalletTransactionDTO,
  WalletDTO,
  CompleteTransactionRequestDTO,
  SignTransactionRequestDTO,
} from "./DTOs/dtos.index";
import {
  WalletCreatedEvent,
  WalletTransactionSignedEvent,
  WalletDebitTxnCreatedEvent,
  WalletCreditTxnCreatedEvent,
  WalletTxnCompletedEvent,
} from "./events/events.index";
import { WalletHolder } from "./WalletHolder";
import { WalletTransaction } from "./WalletTransaction";
import { WalletStatus } from "./WalletStatus";
import { WalletType } from "./WalletType";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { WalletService } from "../WalletService";
import {
  MaxDailyCreditAmountLimitShouldNotBeExceeded,
  MaxDailyDebitAmountLimitShouldNotBeExceeded,
  TransactionShouldNotHaveBeenCompleted,
  TransactionSigneeShouldBeUnique,
  TxnAmountShouldNotExceedBalance,
  WalletHolderAccountShouldBeVerified,
  WalletTxnShouldBeSignedByMinNumOfHolders,
} from "./rules/rules.index";
import { WalletBalance } from "./WalletBalance";

export class WalletProps {
  id: UniqueEntityID;
  name: string;
  number: string;
  @Type(() => WalletType)
  type: WalletType;
  @Type(() => WalletStatus)
  status: WalletStatus;
  balance: WalletBalance;
  ledgerBalance: WalletBalance;
  maxDailyCreditAmount: number;
  maxDailyDebitAmount: number;
  minTxnSignees: number;
  @Type(() => WalletHolder)
  holders: WalletHolder[];
  @Type(() => WalletTransaction)
  transactions: WalletTransaction[];
  createdAt: Date;
  meta: object;
}

export class Wallet extends AggregateRoot<WalletProps> {
  constructor(dto?: WalletDTO) {
    super(dto, WalletProps);
  }

  private findTransaction(id: string): WalletTransaction {
    return this.props.transactions.find((t) => t.ID.equals(new UniqueEntityID(id)));
  }

  private findHolder(id: string): WalletHolder {
    return this.props.holders.find((h) => h.ID.equals(new UniqueEntityID(id)));
  }

  async createCreditTransaction(
    request: NewWalletTransactionDTO,
    walletService: WalletService,
  ): Promise<void> {
    await this.checkRule(
      new MaxDailyCreditAmountLimitShouldNotBeExceeded(this.props, request.amount, walletService),
    );
    this.apply(new WalletCreditTxnCreatedEvent(request));
  }

  async createDebitTransaction(
    request: NewWalletTransactionDTO,
    walletService: WalletService,
  ): Promise<void> {
    await this.checkRule(new TxnAmountShouldNotExceedBalance(this.props.balance, request.amount));
    await this.checkRule(
      new MaxDailyDebitAmountLimitShouldNotBeExceeded(this.props, request.amount, walletService),
    );
    this.apply(new WalletDebitTxnCreatedEvent(request));
  }

  async completeTransaction(request: CompleteTransactionRequestDTO): Promise<void> {
    const transaction = this.findTransaction(request.transactionId);
    await this.checkRule(new TransactionShouldNotHaveBeenCompleted(transaction));
    if (transaction.IS_DEBIT) {
      await this.checkRule(new WalletTxnShouldBeSignedByMinNumOfHolders(this.props, transaction));
    }
    const walletTxnCompletedEvent = new WalletTxnCompletedEvent(request);
    transaction.apply(walletTxnCompletedEvent);
    this.addDomainEvent(walletTxnCompletedEvent);
  }

  async signTransaction(request: SignTransactionRequestDTO): Promise<void> {
    const transaction = this.findTransaction(request.transactionId);
    const holder = this.findHolder(request.holderId);
    await this.checkRule(new TransactionShouldNotHaveBeenCompleted(transaction));
    await this.checkRule(new TransactionSigneeShouldBeUnique(transaction, holder));
    const walletTransactionSignedEvent = new WalletTransactionSignedEvent(request);
    transaction.apply(walletTransactionSignedEvent);
    this.addDomainEvent(walletTransactionSignedEvent);
  }

  static async Create(request: NewWalletDTO, walletService: WalletService): Promise<Wallet> {
    const wallet = new Wallet();
    await wallet.checkRule(new WalletHolderAccountShouldBeVerified(request.ownerId, walletService));
    wallet.apply(new WalletCreatedEvent(request));
    return wallet;
  }

  private $whenWalletCreated($event: WalletCreatedEvent) {
    this.mapToProps($event.payload);
    if (this.props.type.equals(WalletType.Personal)) {
      this.props.maxDailyCreditAmount = 100000;
      this.props.maxDailyDebitAmount = 50000;
    } else {
      this.props.maxDailyCreditAmount = 1000000;
      this.props.maxDailyDebitAmount = 500000;
    }
  }

  private $whenWalletDebitTxnCreatedEvent($event: WalletDebitTxnCreatedEvent) {
    const transaction = WalletTransaction.Create($event.payload);
    this.props.balance = this.props.balance.subtract($event.payload.amount);
    this.props.transactions.push(transaction);
  }

  private $whenWalletCreditTxnCreatedEvent($event: WalletCreditTxnCreatedEvent) {
    const transaction = WalletTransaction.Create($event.payload);
    this.props.balance = this.props.balance.add($event.payload.amount);
    this.props.transactions.push(transaction);
  }
}
