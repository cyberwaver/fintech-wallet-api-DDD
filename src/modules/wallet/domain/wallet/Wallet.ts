import { plainToClass, Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import {
  NewWalletDTO,
  NewWalletTransactionDTO,
  NewWalletLienDTO,
  NewWalletAssetTransferDTO,
} from './dto/dtos.index';
import {
  WalletCreatedEvent,
  WalletFinancialTxnCreatedEvent,
  WalletAuthFinancialTxnCreatedEvent,
  WalletSettlementTxnCreatedEvent,
  WalletReversalTxnCreatedEvent,
  WalletAssetTransferCreatedEvent,
  WalletAssetTransferSignedEvent,
  WalletAssetTransferCompletedEvent,
} from './events/events.index';
import { WalletHolder } from './WalletHolder';
import { WalletTransaction } from './WalletTransaction';
import { WalletStatus } from './WalletStatus';
import { WalletType } from './WalletType';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletService } from '../WalletService';
import {
  TransactionTypeAmountLimitShouldNotBeExceeded,
  TransactionTypeCountLimitShouldNotBeExceeded,
  AmountShouldNotExceedBalance,
  WalletHolderAccountShouldBeVerified,
  LienShouldBeActive,
  LienReleaseAmountShouldNotBeGreaterThanAvailableBalance,
  AssetTransferShouldBePending,
  AssetTransferSigneeShouldBeUnique,
  RequestInitiatorShouldBeWalletAdministrator,
  AmountShouldNotExceedHolderStakeBalance,
  WalletHolderShouldBeAStakeHolder,
  AssetTransferShouldHaveReachedSetThreshold,
} from './rules/rules.index';
import { WalletBalance } from './WalletBalance';
import {
  ApplicationException,
  DomainValidationException,
} from 'src/common/exceptions/exceptions.index';
import { WalletTransactionClass } from './WalletTransactionClass';
import { WalletLien } from './WalletLien';
import { WalletAuthTxnCreatedEvent } from './events/WalletAuthTxnCreatedEvent';
import { WalletLienStatus } from './WalletLienStatus';
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
import { Amount } from 'src/common/domain/Amount';
import { WalletAssetTransfer } from './WalletAssetTransfer';

export class WalletProps {
  id: WalletId;
  templateId: WalletTemplateId;
  name: string;
  number: string;
  @Type(() => WalletType)
  type: WalletType;
  @Type(() => WalletStatus)
  status: WalletStatus;
  balance: WalletBalance;
  availableBalance: WalletBalance;
  ledgerBalance: WalletBalance;
  maxDailyCreditAmount: number;
  maxDailyDebitAmount: number;
  @Type(() => WalletHolder)
  holders: WalletHolder[];
  @Type(() => WalletTransaction)
  transactions: WalletTransaction[];
  @Type(() => WalletLien)
  liens: WalletLien[];
  @Type(() => WalletAssetTransfer)
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

  public getAmountLimitExceededType(
    amount: Amount,
    txnType: WalletTransactionType,
  ): WalletLimitType {
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

  public calcHolderAssetTransferEligibleStake(
    transfer: WalletAssetTransfer,
    holder: WalletHolder,
  ): Amount {
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
    await this.checkRule(
      new TransactionTypeAmountLimitShouldNotBeExceeded(request.amount, request.type, this),
    );
    await this.checkRule(new TransactionTypeCountLimitShouldNotBeExceeded(request.type, this));
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
    if (transfer.STAKE_THRESHOLD_REACHED) await this.completeAssetTransfer(transfer.ID);
  }

  async completeAssetTransfer(transferId: UniqueEntityID): Promise<void> {
    const transfer = this.find(this.props.transfers, transferId);
    this.checkRule(new AssetTransferShouldBePending(transfer));
    this.checkRule(new AssetTransferShouldHaveReachedSetThreshold(transfer));
    this.apply(new WalletAssetTransferCompletedEvent(transferId, this.ID));
  }

  static async create(request: NewWalletDTO, walletService: WalletService): Promise<Wallet> {
    const wallet = new Wallet();
    await wallet.checkRule(new WalletHolderAccountShouldBeVerified(request.ownerId, walletService));
    wallet.apply(new WalletCreatedEvent(request));
    return wallet;
  }

  private getTypeBalance(type: WalletBalanceType): WalletBalance {
    if (type.IS_AVAILABLE) return this.props.availableBalance;
    if (type.IS_LEDGER) return this.props.ledgerBalance;
    return this.props.balance;
  }

  private setTypeBalance(type: WalletBalanceType, balance: WalletBalance): void {
    if (type.IS_AVAILABLE) this.props.availableBalance = balance;
    else if (type.IS_LEDGER) this.props.ledgerBalance = balance;
    else if (type.IS_CURRENT) this.props.balance = balance;
  }

  private async handleAuthorizationRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    await this.checkRule(
      new AmountShouldNotExceedBalance(this.props.availableBalance, request.amount),
    );
    this.apply(new WalletAuthTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleFinancialRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    if (request.type.action.IS_DEBIT) {
      await this.checkRule(
        new AmountShouldNotExceedBalance(this.props.availableBalance, request.amount),
      );
    }
    this.apply(new WalletFinancialTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleAuthFinancialRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    const lien = this.props.liens.find((lien) => lien.txnId.equals(request.originalTxnId));
    if (!lien) {
      throw new DomainValidationException('Lien not found for financial transaction request');
    }

    this.checkRule(new LienShouldBeActive(lien));
    this.checkRule(
      new LienReleaseAmountShouldNotBeGreaterThanAvailableBalance(
        request.amount,
        lien,
        this.props.balance,
      ),
    );
    this.apply(new WalletAuthFinancialTxnCreatedEvent(request, transactionId, this.ID));
  }

  private async handleCompletionRequest(
    request: NewWalletTransactionDTO,
    transactionId: UniqueEntityID,
  ): Promise<void> {
    const lien = this.props.liens.find((lien) => lien.txnId.equals(request.originalTxnId));
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
    this.apply(new WalletSettlementTxnCreatedEvent(request, transactionId, this.ID));
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

  private getTransactionRequestHandler(
    type: WalletTransactionClass | string,
  ): (request: NewWalletTransactionDTO, transactionId: UniqueEntityID) => Promise<void> {
    if (typeof type == 'string') type = new WalletTransactionClass(type);
    if (type.IS_AUTH) return this.handleAuthorizationRequest.bind(this);
    if (type.IS_AUTH_FINANCIAL) return this.handleAuthFinancialRequest.bind(this);
    if (type.IS_FINANCIAL) return this.handleFinancialRequest.bind(this);
    else if (type.IS_COMPLETION) return this.handleCompletionRequest.bind(this);
    else if (type.IS_REVERSAL) return this.handleReversalRequest.bind(this);
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
    const transaction = WalletTransaction.create($event.payload);
    const newLienDTO = plainToClass(NewWalletLienDTO, {
      walletId: this.ID.toString(),
      txnId: transaction.ID.toString(),
      amount: $event.payload.amount,
      status: WalletLienStatus.Active.value,
      expireAt: new Date(),
    });
    const lien = WalletLien.create(newLienDTO);
    this.props.balance = this.props.balance.subtract(new Amount($event.payload.amount));
    this.props.transactions.push(transaction);
    this.props.liens.push(lien);
  }

  private $onWalletAuthFinancialTxnCreatedEvent($event: WalletAuthFinancialTxnCreatedEvent) {
    const lien = this.find(this.props.liens, $event.payload.originalTxnId);
    const transaction = WalletTransaction.create($event.payload);
    this.props.transactions.push(transaction);
    lien.release(new Amount($event.payload.amount), transaction.ID);
  }

  private $onWalletFinancialTxnCreatedEvent($event: WalletFinancialTxnCreatedEvent) {
    const transaction = WalletTransaction.create($event.payload);
    this.props.transactions.push(transaction);
    if (transaction.action.IS_DEBIT) {
      this.props.balance = this.props.balance.subtract(new Amount($event.payload.amount));
    } else {
      this.props.balance = this.props.balance.add(new Amount($event.payload.amount));
    }
  }

  private $onWalletSettlementTxnCreatedEvent($event: WalletSettlementTxnCreatedEvent) {
    const lien = this.find(this.props.liens, $event.payload.originalTxnId);
    const transaction = WalletTransaction.create($event.payload);
    this.props.transactions.push(transaction);
    lien.release(new Amount($event.payload.amount), transaction.ID);
    const offset = lien.getOverflowOffset();
    this.props.balance = this.props.balance.subtract(offset);
    this.props.ledgerBalance = this.props.ledgerBalance.subtract(transaction.amount);
    lien.extinguish('SETTLEMENT');
  }

  private $onWalletReversalTxnCreatedEvent($event: WalletReversalTxnCreatedEvent) {
    const refTxn = this.find(this.props.transactions, $event.payload.originalTxnId);
    const txnData = { ...$event.payload, status: refTxn.action.INVERSE.value };
    const transaction = WalletTransaction.create(txnData);
    this.props.transactions.push(transaction);
    if (refTxn.action.IS_CREDIT) this.props.balance = this.props.balance.add(refTxn.amount);
    else this.props.balance = this.props.balance.subtract(refTxn.amount);
  }
}
