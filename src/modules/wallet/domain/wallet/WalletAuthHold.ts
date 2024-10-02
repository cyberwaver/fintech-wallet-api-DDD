import { Transform, Type } from 'class-transformer';
import { Amount } from 'src/common/domain/Amount';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletAuthHoldDTO } from './dto/dtos.index';
import { WalletId } from './WalletId';
import { WalletAuthHoldStatus } from './WalletAuthHoldStatus';
import { DomainValidationException } from '@Common/exceptions/DomainValidationException';
import { DateTime } from 'luxon';

class WalletAuthHoldProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;

  @Type(() => WalletId)
  walletId: WalletId;

  @Type(() => UniqueEntityID)
  authTxnId: UniqueEntityID;

  @Type(() => WalletAuthHoldStatus)
  status: WalletAuthHoldStatus;

  @Type(() => Amount)
  amount: Amount;

  @Type(() => Amount)
  amountReleased: Amount;

  period: number;

  @Transform(({ value }) => value && DateTime.fromISO(value), { toClassOnly: true })
  @Transform(({ value }) => value.toISO?.(), { toPlainOnly: true })
  expireAt: DateTime;
  hasExpired: boolean;

  @Type(() => Date)
  voidedAt: Date;

  @Type(() => Date)
  releasedAt: Date;

  @Type(() => Date)
  createdAt: Date;
}

export class WalletAuthHold extends Entity<WalletAuthHoldProps> {
  constructor(props?: WalletAuthHoldProps) {
    super(props);
  }

  public readonly status = this.state.status;
  public readonly authTxnId = this.state.authTxnId;
  public readonly amount = this.state.amount;

  public get balance(): Amount {
    return this.amount.subtract(this.state.amountReleased);
  }

  public isAmountReleasable(amount: Amount) {
    return amount.isLessThanOrEquals(this.amount);
  }

  public release(amount: Amount): void {
    if (!this.isAmountReleasable(amount)) {
      throw new DomainValidationException('Hold balance is less than the amount to be released.');
    }
    this.state.amountReleased = this.state.amountReleased.add(amount);
    this.state.status = WalletAuthHoldStatus.PartiallyReleased;
    if (this.state.amountReleased.equals(this.amount)) this.state.status = WalletAuthHoldStatus.Released;
    this.state.releasedAt = new Date();
  }

  public void(): void {
    this.state.status = WalletAuthHoldStatus.Voided;
    this.state.voidedAt = new Date();
  }

  public remove(): void {
    this.state.hasExpired = true;
  }

  public static create(
    data: NewWalletAuthHoldDTO,
    walletId: WalletId,
    id = new UniqueEntityID(),
  ): WalletAuthHold {
    const props = new WalletAuthHoldProps();
    props.id = id;
    props.walletId = walletId;
    props.amount = data.amount;
    props.authTxnId = data.authTxnId;
    props.period = data.period;
    props.createdAt = new Date();

    return new WalletAuthHold(props);
  }
}
