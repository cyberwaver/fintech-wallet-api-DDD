import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletType } from '../WalletType';

export class NewWalletDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Type(() => UniqueEntityID)
  initiatorId: UniqueEntityID;

  @IsNotEmpty()
  @Type(() => WalletType)
  type: WalletType;
}
