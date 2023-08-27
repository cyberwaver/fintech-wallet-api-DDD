import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RequestBulkWalletTransferCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  holderId: string;

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
