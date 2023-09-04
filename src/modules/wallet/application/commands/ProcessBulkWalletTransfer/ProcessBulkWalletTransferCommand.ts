import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ProcessBulkWalletTransferCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  originalTxnId: string;

  @IsNotEmpty()
  @Type(() => WalletPayeeDTO)
  payees: WalletPayeeDTO[];

  @IsNotEmpty()
  description: string;
}

class WalletPayeeDTO {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  amount: number;
}
