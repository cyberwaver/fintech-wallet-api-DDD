import { Transform, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { Amount } from 'src/common/domain/Amount';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletAssetTransferDTO } from './dto/dtos.index';
import { WalletAssetTransferStatus } from './WalletAssetTransferStatus';
import { WalletAssetType } from './WalletAssetType';
import { WalletHolder } from './WalletHolder';
import { WalletSignee } from './WalletSignee';

class WalletAssetTransferProps {
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

export class WalletAssetTransfer extends Entity<WalletAssetTransferProps> {
  constructor(props?: WalletAssetTransferProps) {
    super(props);
  }

  public readonly type = this.props.type;
  public readonly status = this.props.status;
  public readonly sourceId = this.props.sourceId;
  public readonly destinationId = this.props.destinationId;
  public readonly value = this.props.value;
  public readonly completedAt = this.props.completedAt;
  public readonly createdAt = this.props.createdAt;

  public get SIGNED_STAKE(): number {
    return this.props.signees.reduce((sum, signee) => sum + signee.value.stake, 0);
  }

  public get STAKE_THRESHOLD_REACHED(): boolean {
    return this.SIGNED_STAKE >= this.props.stakeThreshold;
  }

  public holderHasSigned(holderId: UniqueEntityID): boolean {
    return this.props.signees.some((signee) => signee.value.holderId.equals(holderId));
  }

  public sign(holder: WalletHolder, stake = holder.stake): void {
    if (this.holderHasSigned(holder.ID)) return;
    this.props.signees.push(WalletSignee.of(holder, stake));
  }

  public complete(): void {
    this.props.status = WalletAssetTransferStatus.Completed;
    this.props.completedAt = DateTime.fromJSDate(new Date());
  }

  public static create(data: NewWalletAssetTransferDTO, id?: UniqueEntityID): WalletAssetTransfer {
    const transfer = new WalletAssetTransfer();
    transfer.mapToProps({
      ...data,
      id,
      status: WalletAssetTransferStatus.Pending,
      createdAt: new Date(),
    });
    return transfer;
  }
}
