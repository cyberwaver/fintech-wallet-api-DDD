import { plainToClass, Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import {
  NewWalletDTO,
  NewWalletTransactionDTO,
  CompleteTransactionRequestDTO,
  SignTransactionRequestDTO,
  NewWalletLienDTO,
} from './DTOs/dtos.index';
import {
  WalletCreatedEvent,
  WalletTransactionSignedEvent,
  WalletFinancialTxnCreatedEvent,
  WalletTxnCompletedEvent,
  WalletSettlementTxnCreatedEvent,
} from './events/events.index';
import { WalletHolder } from './WalletHolder';
import { WalletTransaction } from './WalletTransaction';
import { WalletStatus } from './WalletStatus';
import { WalletType } from './WalletType';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletService } from '../WalletService';
import {
  MaxDailyCreditAmountLimitShouldNotBeExceeded,
  MaxDailyDebitAmountLimitShouldNotBeExceeded,
  TransactionShouldNotHaveBeenCompleted,
  TransactionSigneeShouldBeUnique,
  TxnAmountShouldNotExceedBalance,
  WalletHolderAccountShouldBeVerified,
  WalletTxnShouldBeSignedByMinNumOfHolders,
  LienShouldBeActive,
  LienReleaseAmountShouldNotBeGreaterThanAvailableBalance,
} from './rules/rules.index';
import { WalletBalance } from './WalletBalance';
import { DomainValidationException } from 'src/common/exceptions/exceptions.index';
import { WalletTransactionType } from './WalletTransactionType';
import { WalletLien } from './WalletLien';
import { WalletAuthTxnCreatedEvent } from './events/WalletAuthTxnCreatedEvent';
import { WalletLienStatus } from './WalletLienStatus';
import { WalletTransactionAction } from './WalletTransactionAction';

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
  @Type(() => WalletLien)
  liens: WalletLien[];
  createdAt: Date;
  meta: unknown;
}

export class Wallet extends AggregateRoot<WalletProps> {
  constructor(props?: WalletProps) {
    super(props);
  }

  private findTransaction(id: string): WalletTransaction {
    return this.props.transactions.find((t) => t.ID.equals(new UniqueEntityID(id)));
  }

  private findHolder(id: string): WalletHolder {
    return this.props.holders.find((h) => h.ID.equals(new UniqueEntityID(id)));
  }

  public async handleTransactionRequest(
    request: NewWalletTransactionDTO,
    walletService: WalletService,
  ): Promise<UniqueEntityID> {
    const transactionId = new UniqueEntityID();
    const type = new WalletTransactionType(request.type);
    if (type.IS_AUTH) this.handleAuthorizationRequest(request, transactionId, walletService);
    else if (type.IS_FINANCIAL) this.handleFinancialRequest(request, transactionId, walletService);
    else if (type.IS_SETTLEMENT) this.handleSettlementRequest(request, transactionId);
    return transactionId;
  }

  private async handleAuthorizationRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
    walletService: WalletService,
  ): Promise<void> {
    await this.checkRule(new TxnAmountShouldNotExceedBalance(this.props.balance, request.amount));
    await this.checkRule(
      new MaxDailyDebitAmountLimitShouldNotBeExceeded(this.props, request.amount, walletService),
    );
    this.apply(new WalletAuthTxnCreatedEvent(request, transactionId));
  }

  private async handleFinancialRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
    walletService: WalletService,
  ): Promise<void> {
    if (WalletTransactionAction.Credit.equals(request.action)) {
      await this.checkRule(
        new MaxDailyCreditAmountLimitShouldNotBeExceeded(this.props, request.amount, walletService),
      );
    } else {
      await this.checkRule(new TxnAmountShouldNotExceedBalance(this.props.balance, request.amount));
      await this.checkRule(
        new MaxDailyDebitAmountLimitShouldNotBeExceeded(this.props, request.amount, walletService),
      );
    }
    this.apply(new WalletFinancialTxnCreatedEvent(request, transactionId));
  }

  private async handleSettlementRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    const lien = this.props.liens.find((lien) => lien.txnId.equals(request.referenceTxnId));
    if (!lien) {
      throw new DomainValidationException('Lien not found for settlement transaction request');
    }

    await this.checkRule(new LienShouldBeActive(lien));
    await this.checkRule(
      new LienReleaseAmountShouldNotBeGreaterThanAvailableBalance(
        request.amount,
        lien,
        this.props.balance,
      ),
    );
    this.apply(new WalletSettlementTxnCreatedEvent(request, transactionId));
  }

  async completeTransaction(request: CompleteTransactionRequestDTO): Promise<void> {
    const transaction = this.findTransaction(request.transactionId);
    await this.checkRule(new TransactionShouldNotHaveBeenCompleted(transaction));
    if (transaction.action.IS_DEBIT) {
      await this.checkRule(new WalletTxnShouldBeSignedByMinNumOfHolders(this.props, transaction));
    }
    const walletTxnCompletedEvent = new WalletTxnCompletedEvent(request);
    this.apply(walletTxnCompletedEvent);
  }

  async signTransaction(request: SignTransactionRequestDTO): Promise<void> {
    const transaction = this.findTransaction(request.transactionId);
    if (!transaction) {
      throw new DomainValidationException('Transaction not found.');
    }
    const holder = this.findHolder(request.holderId);
    await this.checkRule(new TransactionShouldNotHaveBeenCompleted(transaction));
    await this.checkRule(new TransactionSigneeShouldBeUnique(transaction, holder));
    const walletTransactionSignedEvent = new WalletTransactionSignedEvent(request);
    this.apply(walletTransactionSignedEvent);
  }

  static async create(request: NewWalletDTO, walletService: WalletService): Promise<Wallet> {
    const wallet = new Wallet();
    await wallet.checkRule(new WalletHolderAccountShouldBeVerified(request.ownerId, walletService));
    wallet.apply(new WalletCreatedEvent(request));
    return wallet;
  }

  private $onWalletCreatedEvent($event: WalletCreatedEvent) {
    this.mapToProps($event.payload);
    if (this.props.type.equals(WalletType.Personal)) {
      this.props.maxDailyCreditAmount = 100_000;
      this.props.maxDailyDebitAmount = 50_000;
    } else {
      this.props.maxDailyCreditAmount = 1_000_000;
      this.props.maxDailyDebitAmount = 500_000;
    }
  }

  private $onWalletTxnCompletedEvent($event: WalletTxnCompletedEvent) {
    const transaction = this.findTransaction($event.payload.transactionId);
    transaction.complete();
  }

  private $onWalletTransactionSignedEvent($event: WalletTransactionSignedEvent) {
    const transaction = this.findTransaction($event.payload.transactionId);
    const holder = this.findHolder($event.payload.holderId);
    transaction.addASignee(holder);
  }

  private $onWalletAuthTxnCreatedEvent($event: WalletAuthTxnCreatedEvent) {
    const transaction = WalletTransaction.create($event.payload);
    const newLienDTO = plainToClass(NewWalletLienDTO, {
      walletId: this.ID.toString(),
      txnId: transaction.ID.toString(),
      amount: $event.payload.amount,
      status: WalletLienStatus.Active.value,
      expireAt: new Date(),
    });
    const lien = WalletLien.create(newLienDTO);
    this.props.balance = this.props.balance.subtract($event.payload.amount);
    this.props.transactions.push(transaction);
    this.props.liens.push(lien);
  }

  private $onWalletFinancialTxnCreatedEvent($event: WalletFinancialTxnCreatedEvent) {
    const transaction = WalletTransaction.create($event.payload);
    this.props.transactions.push(transaction);
    if (transaction.action.IS_DEBIT) {
      this.props.balance = this.props.balance.subtract($event.payload.amount);
    } else {
      this.props.balance = this.props.balance.add($event.payload.amount);
    }
  }

  private $onWalletSettlementTxnCreatedEvent($event: WalletSettlementTxnCreatedEvent) {
    const lien = this.props.liens.find(({ txnId }) => txnId.equals($event.payload.referenceTxnId));
    const transaction = WalletTransaction.create($event.payload);
    this.props.transactions.push(transaction);
    lien.release($event.payload.amount, transaction.ID);
  }
}
