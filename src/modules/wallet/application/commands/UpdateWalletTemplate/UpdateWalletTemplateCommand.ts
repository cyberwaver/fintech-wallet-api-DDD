import { UpdateWalletTemplateDTO } from '@Wallet/domain/wallet-template/DTOs/UpdateWalletTemplateDTO';
import { IsNotEmpty } from 'class-validator';

export class UpdateWalletTemplateCommand extends UpdateWalletTemplateDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  accountTiers: number[];
}
