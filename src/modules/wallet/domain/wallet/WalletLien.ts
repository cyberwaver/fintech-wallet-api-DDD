import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletLienDTO } from './DTOs/dtos.index';
import { WalletLienStatus } from './WalletLienStatus';

class WalletLienProps {
  id: UniqueEntityID;
  walletId: UniqueEntityID;
  txnId: UniqueEntityID;
  completionTxnId: UniqueEntityID;
  status: WalletLienStatus;
  amount: number;
  amountReleased: number;
  expireAt: Date;
  createdAt: Date;
}

export class WalletLien extends Entity<WalletLienProps> {
  constructor(props?: WalletLienProps) {
    super(props);
  }

  public readonly status = this.props.status;
  public readonly txnId = this.props.txnId;
  public readonly amount = this.props.amount;

  public release(amount: number, txnId: UniqueEntityID): void {
    this.props.completionTxnId = txnId;
    this.props.amountReleased = amount;
    if (amount < this.amount) this.props.status = WalletLienStatus.PartiallyReleased;
    else WalletLienStatus.Released;
  }

  public static create(data: NewWalletLienDTO): WalletLien {
    const lien = new WalletLien();
    lien.mapToProps(data);
    return lien;
  }
}
