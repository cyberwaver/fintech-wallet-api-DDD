import { Expose, plainToClass, Transform, Type } from 'class-transformer';

import { AggregateRoot } from '@Common/domain/AggregateRoot';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { ApplicationException, DomainValidationException } from '@Common/exceptions/exceptions.index';
import { Amount } from '@Common/domain/Amount';

import {
  NewWalletDTO,
  NewWalletTransactionDTO,
  NewWalletAuthHoldDTO,
  NewWalletAssetTransferDTO,
} from './dto/dtos.index';
import {
  WalletCreatedEvent,
  WalletAuthTxnCreatedEvent,
  WalletAuthAdvTxnCreatedEvent,
  WalletFinancialTxnCreatedEvent,
  WalletFinancialAdvTxnCreatedEvent,
  WalletReversalTxnCreatedEvent,
  WalletReversalAdvTxnCreatedEvent,
  WalletAssetTransferCreatedEvent,
  WalletAssetTransferSignedEvent,
  WalletAssetTransferCompletedEvent,
} from './events/events.index';
import {
  TransactionTypeAmountLimitShouldNotBeExceeded,
  TransactionTypeCountLimitShouldNotBeExceeded,
  AmountShouldNotExceedBalance,
  WalletHolderAccountShouldBeVerified,
  WalletAuthHoldShouldBeActive,
  ReleaseAmountShouldNotBeGreaterThanAuthHoldBalance,
  AssetTransferShouldBePending,
  AssetTransferSigneeShouldBeUnique,
  RequestInitiatorShouldBeWalletAdministrator,
  AmountShouldNotExceedHolderStakeBalance,
  WalletHolderShouldBeAStakeHolder,
  AssetTransferShouldHaveReachedSetThreshold,
} from './rules/rules.index';
import { WalletHolder } from './WalletHolder';
import { WalletTransaction } from './WalletTransaction';
import { WalletStatus } from './WalletStatus';
import { WalletType } from './WalletType';
import { WalletService } from '../WalletService';
import { WalletBalance } from './WalletBalance';
import { WalletTransactionClass } from './WalletTransactionClass';
import { WalletAuthHold } from './WalletAuthHold';
import { WalletAuthHoldStatus } from './WalletAuthHoldStatus';
import { WalletSharedTypeOnlyAllowed } from './rules/WalletSharedTypeOnlyAllowed';
import { WalletBalanceType } from './WalletBalanceType';
import { WalletTransactionType } from './WalletTransactionType';
import { WalletLimit } from './WalletLimit';
import { WalletTransactionTotal } from './WalletTransactionTotal';
import { WalletTransactionCount } from './WalletTransactionCount';
import { WalletLimitType } from './WalletLimitType';
import { WalletTemplate } from '../wallet-template/WalletTemplate';
import { WalletId } from './WalletId';
import { WalletTemplateId } from '../wallet-template/WalletTemplateId';
import { WalletAssetTransfer } from './WalletAssetTransfer';

export class WalletProps {
  @Type(() => WalletId)
  id: WalletId;

  @Type(() => WalletTemplateId)
  @Expose()
  templateId: WalletTemplateId;

  name: string;
  number: string;

  @Type(() => WalletType)
  type: WalletType;

  @Type(() => WalletStatus)
  status: WalletStatus;

  @Type(() => WalletBalance)
  balance: WalletBalance;

  @Type(() => WalletBalance)
  holdBalance: WalletBalance;

  @Type(() => WalletBalance)
  availableBalance: WalletBalance;

  @Type(() => WalletBalance)
  ledgerBalance: WalletBalance;

  @Transform(({ value }) => new WalletHolder(value))
  holders: WalletHolder[];

  @Transform(({ value }) => new WalletTransaction(value))
  transactions: WalletTransaction[];

  @Transform(({ value }) => new WalletAuthHold(value))
  holds: WalletAuthHold[];

  @Transform(({ value }) => new WalletAssetTransfer(value))
  transfers: WalletAssetTransfer[];

  @Type(() => WalletLimit)
  limit: WalletLimit;

  @Type(() => WalletTransactionTotal)
  total: WalletTransactionTotal;

  @Type(() => WalletTransactionCount)
  count: WalletTransactionCount;

  @Type(() => Date)
  createdAt: Date;

  meta: unknown;
}

export class Wallet extends AggregateRoot<WalletProps> {
  constructor(props?: WalletProps) {
    super(props);
  }

  public readonly templateId = this.props.templateId;

  public getAmountLimitExceededType(amount: Amount, txnType: WalletTransactionType): WalletLimitType {
    const { PerTxn, Daily, Weekly, Monthly } = WalletLimitType;
    if (this.props.limit.isAmountExceeded(amount, txnType, PerTxn)) return PerTxn;
    let total = amount.add(this.props.total.getValue(Daily, txnType));
    if (this.props.limit.isAmountExceeded(total, txnType, Daily)) return Daily;
    total = amount.add(this.props.total.getValue(Weekly, txnType));
    if (this.props.limit.isAmountExceeded(total, txnType, Weekly)) return Weekly;
    total = amount.add(this.props.total.getValue(Monthly, txnType));
    if (this.props.limit.isAmountExceeded(total, txnType, Monthly)) return Monthly;
  }

  public getCountLimitExceededType(txnType: WalletTransactionType): WalletLimitType {
    const { Daily, Weekly, Monthly } = WalletLimitType;
    let count = this.props.count.getValue(Daily, txnType) + 1;
    if (this.props.limit.isCountExceeded(count, txnType, Daily)) return Daily;
    count = this.props.count.getValue(Weekly, txnType) + 1;
    if (this.props.limit.isCountExceeded(count, txnType, Weekly)) return Weekly;
    count = this.props.count.getValue(Monthly, txnType) + 1;
    if (this.props.limit.isCountExceeded(count, txnType, Monthly)) return Monthly;
  }

  public calcHolderAssetTransferEligibleStake(transfer: WalletAssetTransfer, holder: WalletHolder): Amount {
    let stake = holder.stake;
    const transfers = this.props.transfers.filter((assetTransfer) => {
      if (!assetTransfer.type.equals(transfer.type)) return false;
      return (
        transfer.createdAt.diff(assetTransfer.createdAt).milliseconds <= 0 &&
        assetTransfer.status.IS_COMPLETED &&
        holder.ID.equals(transfer.destinationId)
      );
    });

    transfers.forEach((assetTransfer) => {
      if (!transfer.holderHasSigned(assetTransfer.sourceId)) return;
      stake = stake.subtract(assetTransfer.value);
    });

    return stake;
  }

  public async handleTransactionRequest(
    request: NewWalletTransactionDTO,
    template: WalletTemplate,
  ): Promise<UniqueEntityID> {
    const handler = this.getTransactionRequestHandler(request.class);
    if (!handler) {
      throw new ApplicationException('Handler not found for request type.');
    }
    this.props.limit = template.constructLimit(this.props.limit);
    this.checkRule(new TransactionTypeAmountLimitShouldNotBeExceeded(request.amount, request.type, this));
    this.checkRule(new TransactionTypeCountLimitShouldNotBeExceeded(request.type, this));
    const transactionId = new UniqueEntityID();
    await handler(request, transactionId);
    return transactionId;
  }

  async requestAssetTransfer(request: NewWalletAssetTransferDTO): Promise<UniqueEntityID> {
    this.checkRule(new WalletSharedTypeOnlyAllowed(this.props.type));
    const administrator = this.find(this.props.holders, request.initiatorId);
    this.checkRule(new RequestInitiatorShouldBeWalletAdministrator(administrator));

    if (request.type.IS_BALANCE) {
      const sourceBalance = this.getTypeBalance(WalletBalanceType.Current);
      this.checkRule(new AmountShouldNotExceedBalance(sourceBalance, request.amount));
    }

    if (request.type.IS_STAKE) {
      const holder = this.find(this.props.holders, request.sourceId);
      this.checkRule(new AmountShouldNotExceedHolderStakeBalance(holder.stake, request.amount));
    }

    if (request.type.IS_CONTROL) {
      const holder = this.find(this.props.holders, request.destinationId);
      this.checkRule(new WalletHolderShouldBeAStakeHolder(holder));
    }

    const transferId = new UniqueEntityID();
    this.apply(new WalletAssetTransferCreatedEvent(request, transferId, this.ID));
    return transferId;
  }

  async signAssetTransfer(transferId: UniqueEntityID, holderId: UniqueEntityID): Promise<void> {
    const transfer = this.find(this.props.transfers, transferId);
    const holder = this.find(this.props.holders, holderId);
    this.checkRule(new AssetTransferShouldBePending(transfer));
    this.checkRule(new AssetTransferSigneeShouldBeUnique(transfer, holder));
    this.apply(new WalletAssetTransferSignedEvent(transferId, holderId, this.ID));
  }

  public async completeAssetTransfer(transferId: UniqueEntityID): Promise<void> {
    const transfer = this.find(this.props.transfers, transferId);
    this.checkRule(new AssetTransferShouldBePending(transfer));
    this.checkRule(new AssetTransferShouldHaveReachedSetThreshold(transfer));
    this.apply(new WalletAssetTransferCompletedEvent(transferId, this.ID));
  }

  static async create(request: NewWalletDTO, walletService: WalletService): Promise<Wallet> {
    const wallet = new Wallet();
    await wallet.checkRule(new WalletHolderAccountShouldBeVerified(request.initiatorId, walletService));
    wallet.apply(new WalletCreatedEvent(request));
    return wallet;
  }

  private getTypeBalance(type: WalletBalanceType): WalletBalance {
    if (type.IS_AVAILABLE) return this.props.availableBalance;
    if (type.IS_LEDGER) return this.props.ledgerBalance;
    return this.props.balance;
  }

  private async handleAuthorizationRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    this.checkRule(new AmountShouldNotExceedBalance(this.props.availableBalance, request.amount));
    this.apply(new WalletAuthTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleAuthorizationAdvice(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    this.apply(new WalletAuthAdvTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleFinancialRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    if (request.type.action.IS_DEBIT) {
      this.checkRule(new AmountShouldNotExceedBalance(this.props.availableBalance, request.amount));
    }
    this.apply(new WalletFinancialTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleFinancialAdvice(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    const hold = this.props.holds.find((hold) => hold.authTxnId.equals(request.originalTxnId));
    if (!hold) {
      throw new DomainValidationException('Auth hold not found for financial transaction request');
    }

    this.checkRule(new WalletAuthHoldShouldBeActive(hold));
    this.checkRule(new ReleaseAmountShouldNotBeGreaterThanAuthHoldBalance(request.amount, hold));
    this.apply(new WalletFinancialAdvTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleReversalRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    const transaction = this.find(this.props.transactions, request.originalTxnId);
    if (!transaction) {
      throw new DomainValidationException('Reference transaction not found.');
    }
    this.apply(new WalletReversalTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleReversalAdvice(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    this.apply(new WalletReversalAdvTxnCreatedEvent(request, transactionId, this.ID));
  }

  private getTransactionRequestHandler(
    type: WalletTransactionClass | string,
  ): (request: NewWalletTransactionDTO, transactionId: UniqueEntityID) => Promise<void> {
    if (typeof type == 'string') type = new WalletTransactionClass(type);
    if (type.IS_AUTH) return this.handleAuthorizationRequest.bind(this);
    if (type.IS_AUTH_ADV) return this.handleAuthorizationAdvice.bind(this);
    if (type.IS_FINANCIAL) return this.handleFinancialRequest.bind(this);
    if (type.IS_FINANCIAL_ADV) return this.handleFinancialAdvice.bind(this);
    if (type.IS_REVERSAL) return this.handleReversalRequest.bind(this);
    if (type.IS_REVERSAL_ADV) return this.handleReversalAdvice.bind(this);
  }

  private $onWalletCreatedEvent($event: WalletCreatedEvent) {
    this.props.id = $event.payload.walletId;
    this.props.name = $event.payload.name;
    this.props.type = $event.payload.type;
    const holder = WalletHolder.create({ walletId: this.props.id, accountId: $event.payload.initiatorId });
    holder.assignAsAdministrator();
    this.props.holders.push(holder);
  }

  private $onWalletAssetTransferCreatedEvent($event: WalletAssetTransferCreatedEvent) {
    const transfer = WalletAssetTransfer.create($event.payload, $event.payload.transferId);
    this.props.transfers.push(transfer);
  }

  private $onWalletAssetTransferSignedEvent($event: WalletAssetTransferSignedEvent) {
    const transfer = this.find(this.props.transfers, $event.payload.transferId);
    const holder = this.find(this.props.holders, $event.payload.holderId);
    transfer.sign(holder);
  }

  private $onWalletAssetTransferCompletedEvent($event: WalletAssetTransferCompletedEvent) {
    const transfer = this.find(this.props.transfers, $event.payload.transferId);

    if (transfer.type.IS_BALANCE) {
      this.props.balance = this.props.balance.subtract(transfer.value);
      this.props.availableBalance = this.props.availableBalance.add(transfer.value);
    }

    if (transfer.type.IS_STAKE) {
      const fromHolder = this.find(this.props.holders, transfer.sourceId);
      const toHolder = this.find(this.props.holders, transfer.destinationId);
      fromHolder.subtractFromStake(transfer.value);
      toHolder.addToStake(transfer.value);
    }

    if (transfer.type.IS_CONTROL) {
      const administrator = this.props.holders.find((holder) => holder.IS_ADMIN);
      const holder = this.find(this.props.holders, transfer.destinationId);
      administrator.revokeAsAdministrator();
      holder.assignAsAdministrator();
    }
  }

  private $onWalletAuthTxnCreatedEvent($event: WalletAuthTxnCreatedEvent) {
    const transaction = WalletTransaction.create($event.payload, this.ID);
    const holdData = new NewWalletAuthHoldDTO();
    holdData.authTxnId = transaction.ID;
    holdData.amount = $event.payload.amount;
    holdData.period = 30;
    const hold = WalletAuthHold.create(holdData, this.ID);
    this.props.holdBalance = this.props.holdBalance.add($event.payload.amount);
    this.props.balance = this.props.balance.subtract($event.payload.amount);
    this.props.transactions.push(transaction);
    this.props.holds.push(hold);
  }

  private $onWalletAuthAdvTxnCreatedEvent($event: WalletAuthAdvTxnCreatedEvent) {
    const transaction = WalletTransaction.create($event.payload, this.ID);
    const hold = this.find(this.props.holds, $event.payload.originalTxnId);
    this.props.holdBalance = this.props.holdBalance.subtract(hold.balance);
    this.props.balance = this.props.balance.add(hold.balance);
    this.props.availableBalance = this.props.ledgerBalance.add(hold.balance);
    hold.remove();
    this.props.transactions.push(transaction);
  }

  private $onWalletFinancialTxnCreatedEvent($event: WalletFinancialTxnCreatedEvent) {
    const transaction = WalletTransaction.create($event.payload, this.ID);
    if (transaction.action.IS_DEBIT) {
      this.props.balance = this.props.balance.subtract($event.payload.amount);
      this.props.availableBalance = this.props.availableBalance.subtract($event.payload.amount);
      this.props.ledgerBalance = this.props.ledgerBalance.subtract($event.payload.amount);
    } else {
      this.props.balance = this.props.balance.add($event.payload.amount);
      this.props.availableBalance = this.props.availableBalance.add($event.payload.amount);
      this.props.ledgerBalance = this.props.ledgerBalance.add($event.payload.amount);
    }
    this.props.transactions.push(transaction);
  }

  private $onWalletFinancialAdvTxnCreatedEvent($event: WalletFinancialAdvTxnCreatedEvent) {
    const hold = this.find(this.props.holds, $event.payload.originalTxnId);
    const transaction = WalletTransaction.create($event.payload, this.ID);
    this.props.transactions.push(transaction);
    hold.release($event.payload.amount);
  }

  private $onWalletReversalTxnCreatedEvent($event: WalletReversalTxnCreatedEvent) {
    const refTxn = this.find(this.props.transactions, $event.payload.originalTxnId);
    const txnData = { ...$event.payload, status: refTxn.action.INVERSE.value };
    const transaction = WalletTransaction.create(txnData, this.ID);
    this.props.transactions.push(transaction);
    if (refTxn.action.IS_CREDIT) this.props.balance = this.props.balance.add(refTxn.amount);
    else this.props.balance = this.props.balance.subtract(refTxn.amount);
  }
}
