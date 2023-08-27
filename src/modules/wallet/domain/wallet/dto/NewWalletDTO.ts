import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { WalletType } from '../WalletType';

export class NewWalletDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  @Type(() => WalletType)
  type: WalletType;
}
