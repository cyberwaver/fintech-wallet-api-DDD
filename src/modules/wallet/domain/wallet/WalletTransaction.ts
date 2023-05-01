import { Type } from 'class-transformer';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletTransactionDTO } from './DTOs/dtos.index';
import { WalletHolder } from './WalletHolder';
import { WalletTransactionSignee } from './WalletTransactionSignee';
import { WalletTransactionStatus } from './WalletTransactionStatus';
import { WalletTransactionAction } from './WalletTransactionAction';
import { WalletTransactionType } from './WalletTransactionType';

export class WalletTransactionProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;
  walletId: string;
  amount: number;
  @Type(() => WalletTransactionType)
  type: WalletTransactionType;
  @Type(() => WalletTransactionStatus)
  status: WalletTransactionStatus;
  @Type(() => WalletTransactionAction)
  action: WalletTransactionAction;
  @Type(() => WalletTransactionSignee)
  signees: WalletTransactionSignee[];
  @Type(() => Date)
  createdAt: Date;
}

export class WalletTransaction extends Entity<WalletTransactionProps> {
  public readonly type = this.props.type;
  public readonly status = this.props.status;
  public readonly action = this.props.action;
  public readonly SIGNEES_COUNT = this.props.signees.length;

  constructor(props?: WalletTransactionProps) {
    super(props);
  }

  isASignee(holder: WalletHolder): boolean {
    return this.props.signees.some((s) => s.value.holderId === holder.ID.toString());
  }

  addASignee(holder: WalletHolder): void {
    this.props.signees.push(new WalletTransactionSignee({ holderId: holder.ID.toString() }));
  }

  complete(): void {
    this.props.status = WalletTransactionStatus.Completed;
  }

  public static create(data: NewWalletTransactionDTO): WalletTransaction {
    const transaction = new WalletTransaction();
    transaction.mapToProps(data);
    return transaction;
  }
}
