import { Transform, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { Amount } from 'src/common/domain/Amount';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletAssetTransferDTO } from './dto/dtos.index';
import { WalletAssetTransferStatus } from './WalletAssetTransferStatus';
import { WalletAssetType } from './WalletAssetType';
import { WalletHolder } from './WalletHolder';
import { WalletId } from './WalletId';
import { WalletSignee } from './WalletSignee';

class WalletAssetTransferState {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;

  @Type(() => UniqueEntityID)
  walletId: UniqueEntityID;

  @Type(() => WalletAssetType)
  type: WalletAssetType;

  @Type(() => WalletAssetTransferStatus)
  status: WalletAssetTransferStatus;

  @Type(() => UniqueEntityID)
  sourceId: UniqueEntityID;

  @Type(() => UniqueEntityID)
  destinationId: UniqueEntityID;

  @Type(() => Amount)
  value: Amount;

  @Type(() => WalletSignee)
  signees: WalletSignee[];

  stakeThreshold: number;
  note: string;

  @Transform(({ value }) => value && DateTime.fromISO(value), { toClassOnly: true })
  @Transform(({ value }) => value.toISO?.(), { toPlainOnly: true })
  completedAt: DateTime;

  @Transform(({ value }) => DateTime.fromISO(value), { toClassOnly: true })
  @Transform(({ value }) => value.toISO?.(), { toPlainOnly: true })
  createdAt: DateTime;
}

export class WalletAssetTransfer extends Entity<WalletAssetTransferState> {
  constructor(state?: WalletAssetTransferState) {
    super(state);
  }

  public readonly type = this.state.type;
  public readonly status = this.state.status;
  public readonly sourceId = this.state.sourceId;
  public readonly destinationId = this.state.destinationId;
  public readonly value = this.state.value;
  public readonly completedAt = this.state.completedAt;
  public readonly createdAt = this.state.createdAt;

  public get SIGNED_STAKE(): number {
    return this.state.signees.reduce((sum, signee) => sum + signee.value.stake, 0);
  }

  public get STAKE_THRESHOLD_REACHED(): boolean {
    return this.SIGNED_STAKE >= this.state.stakeThreshold;
  }

  public holderHasSigned(holderId: UniqueEntityID): boolean {
    return this.state.signees.some((signee) => signee.value.holderId.equals(holderId));
  }

  public sign(holder: WalletHolder, stake = holder.stake): void {
    if (this.holderHasSigned(holder.ID)) return;
    this.state.signees.push(WalletSignee.of(holder, stake));
  }

  public complete(): void {
    this.state.status = WalletAssetTransferStatus.Completed;
    this.state.completedAt = DateTime.now();
  }

  public static create(
    data: NewWalletAssetTransferDTO,
    walletId: WalletId,
    id = new UniqueEntityID(),
  ): WalletAssetTransfer {
    const state = new WalletAssetTransferState();
    state.id = id;
    state.walletId = walletId;
    state.type = data.type;
    state.value = data.amount;
    state.sourceId = data.sourceId;
    state.destinationId = data.destinationId;
    state.createdAt = DateTime.now();

    return new WalletAssetTransfer(state);
  }
}
