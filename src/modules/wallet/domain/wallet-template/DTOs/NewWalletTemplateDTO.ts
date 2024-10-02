import { IsNotEmpty } from 'class-validator';
import { UpdateWalletTemplateDTO } from './UpdateWalletTemplateDTO';

export class NewWalletTemplateDTO extends UpdateWalletTemplateDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  accountTiers: number[];
}
