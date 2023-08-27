import { Type } from 'class-transformer';
import { Amount } from 'src/common/domain/Amount';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletHolderDTO } from './dto/dtos.index';
import { WalletHolderStatus } from './WalletHolderStatus';
import { WalletId } from './WalletId';

class WalletHolderProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;

  @Type(() => WalletId)
  walletId: WalletId;

  accountId: string;

  @Type(() => WalletHolderStatus)
  status: WalletHolderStatus;

  @Type(() => Amount)
  stake: Amount;

  isAdministrator: boolean;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}

export class WalletHolder extends Entity<WalletHolderProps> {
  constructor(props?: WalletHolderProps) {
    super(props);
  }

  public readonly stake = this.props.stake;
  public readonly IS_ADMIN = this.props.isAdministrator;

  public addToStake(value: Amount): void {
    this.props.stake = this.props.stake.add(value);
    this.props.updatedAt = new Date();
  }

  public subtractFromStake(value: Amount): void {
    this.props.stake = this.props.stake.subtract(value);
    this.props.updatedAt = new Date();
  }

  public assignAsAdministrator(): void {
    this.props.isAdministrator = true;
    this.props.updatedAt = new Date();
  }

  public revokeAsAdministrator(): void {
    this.props.isAdministrator = false;
    this.props.updatedAt = new Date();
  }

  public static create(data: NewWalletHolderDTO): WalletHolder {
    const holder = new WalletHolder();
    holder.mapToProps({ ...data, createdAt: new Date() });
    return holder;
  }
}
