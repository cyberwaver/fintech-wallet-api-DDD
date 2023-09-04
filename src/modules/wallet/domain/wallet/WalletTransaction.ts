import { Type } from 'class-transformer';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletId } from './WalletId';
import { NewWalletTransactionDTO } from './dto/dtos.index';
import { WalletTransactionStatus } from './WalletTransactionStatus';
import { WalletTransactionAction } from './WalletTransactionAction';
import { WalletTransactionClass } from './WalletTransactionClass';
import { WalletTransactionType } from './WalletTransactionType';
import { Amount } from 'src/common/domain/Amount';

export class WalletTransactionProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;
  walletId: WalletId;
  originalTxnId: UniqueEntityID;
  @Type(() => Amount)
  amount: Amount;
  @Type(() => Amount)
  amountCompleted: Amount;
  @Type(() => WalletTransactionClass)
  class: WalletTransactionClass;
  @Type(() => WalletTransactionType)
  type: WalletTransactionType;
  @Type(() => WalletTransactionStatus)
  status: WalletTransactionStatus;
  @Type(() => WalletTransactionAction)
  action: WalletTransactionAction;
  description: string;
  @Type(() => Date)
  completedAt: Date;
  @Type(() => Date)
  createdAt: Date;
  meta: unknown;
}

export class WalletTransaction extends Entity<WalletTransactionProps> {
  public readonly amount = this.props.amount;
  public readonly type = this.props.type;
  public readonly status = this.props.status;
  public readonly action = this.props.action;

  constructor(props?: WalletTransactionProps) {
    super(props);
  }

  complete(): void {
    this.props.status = WalletTransactionStatus.Completed;
    this.props.completedAt = new Date();
  }

  public static create(data: NewWalletTransactionDTO, walletId: WalletId): WalletTransaction {
    const props = new WalletTransactionProps();
    props.id = new UniqueEntityID();
    props.walletId = walletId;
    props.class = data.class;
    props.type = data.type;
    props.action = data.type.action;
    props.amount = data.amount;
    props.description = data.description;
    props.originalTxnId = data.originalTxnId;

    return new WalletTransaction(props);
  }
}
