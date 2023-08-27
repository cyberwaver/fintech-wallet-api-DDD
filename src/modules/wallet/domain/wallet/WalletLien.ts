import { Type } from 'class-transformer';
import { Amount } from 'src/common/domain/Amount';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletLienDTO } from './dto/dtos.index';
import { WalletId } from './WalletId';
import { WalletLienStatus } from './WalletLienStatus';

class WalletLienProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;

  @Type(() => WalletId)
  walletId: WalletId;

  @Type(() => UniqueEntityID)
  transactionId: UniqueEntityID;

  @Type(() => UniqueEntityID)
  completionTxnId: UniqueEntityID;

  @Type(() => WalletLienStatus)
  status: WalletLienStatus;

  @Type(() => Amount)
  amount: Amount;

  @Type(() => Amount)
  amountReleased: Amount;

  reason: string;

  @Type(() => Date)
  toExpireAt: Date;

  @Type(() => Date)
  extinguishedAt: Date;

  @Type(() => Date)
  releasedAt: Date;

  @Type(() => Date)
  createdAt: Date;
}

export class WalletLien extends Entity<WalletLienProps> {
  constructor(props?: WalletLienProps) {
    super(props);
  }

  public readonly status = this.props.status;
  public readonly txnId = this.props.transactionId;
  public readonly amount = this.props.amount;

  public release(amount: Amount, txnId: UniqueEntityID): void {
    this.props.completionTxnId = txnId;
    this.props.amountReleased = amount;
    if (amount.isLessThan(this.amount)) this.props.status = WalletLienStatus.PartiallyReleased;
    else this.props.status = WalletLienStatus.Released;
    this.props.releasedAt = new Date();
  }

  public getOverflowOffset(): Amount {
    if (this.props.amountReleased.isLessThan(this.props.amount)) return Amount.Zero;
    return this.props.amountReleased.subtract(this.props.amount);
  }

  public extinguish(reason = 'EXPIRED'): void {
    this.props.status = WalletLienStatus.Extinguished;
    this.props.extinguishedAt = new Date();
    this.props.reason = reason;
  }

  public static create(data: NewWalletLienDTO): WalletLien {
    const lien = new WalletLien();
    lien.mapToProps(data);
    return lien;
  }
}
