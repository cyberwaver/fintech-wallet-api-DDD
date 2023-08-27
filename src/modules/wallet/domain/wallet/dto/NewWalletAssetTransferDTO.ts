import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Amount } from 'src/common/domain/Amount';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletAssetType } from '../WalletAssetType';

export class NewWalletAssetTransferDTO {
  @IsNotEmpty()
  @Type(() => UniqueEntityID)
  initiatorId: UniqueEntityID;

  @Type(() => UniqueEntityID)
  type: WalletAssetType;

  @IsOptional()
  @Transform(({ value }) => Amount.create(value))
  amount?: Amount;

  @Type(() => UniqueEntityID)
  sourceId: UniqueEntityID;

  @Type(() => UniqueEntityID)
  destinationId: UniqueEntityID;
}
