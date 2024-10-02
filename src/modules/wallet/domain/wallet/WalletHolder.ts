import { Expose, Type } from 'class-transformer';
import { Amount } from 'src/common/domain/Amount';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletHolderDTO } from './dto/dtos.index';
import { WalletHolderStatus } from './WalletHolderStatus';
import { WalletId } from './WalletId';

export class WalletHolderState {
  @Type(() => UniqueEntityID)
  @Expose()
  id: UniqueEntityID;

  @Type(() => WalletId)
  walletId: WalletId;

  accountId: UniqueEntityID;

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

export class WalletHolder extends Entity<WalletHolderState> {
  constructor(state?: WalletHolderState) {
    super(state);
  }

  public readonly stake = this.state.stake;
  public readonly IS_ADMIN = this.state.isAdministrator;

  public addToStake(value: Amount): void {
    this.state.stake = this.state.stake.add(value);
    this.state.updatedAt = new Date();
  }

  public subtractFromStake(value: Amount): void {
    this.state.stake = this.state.stake.subtract(value);
    this.state.updatedAt = new Date();
  }

  public assignAsAdministrator(): void {
    this.state.isAdministrator = true;
    this.state.updatedAt = new Date();
  }

  public revokeAsAdministrator(): void {
    this.state.isAdministrator = false;
    this.state.updatedAt = new Date();
  }

  public static create(data: NewWalletHolderDTO): WalletHolder {
    const state = new WalletHolderState();
    state.id = new UniqueEntityID();
    state.walletId = data.walletId;
    state.accountId = data.accountId;
    const holder = new WalletHolder(state);
    return holder;
  }
}
