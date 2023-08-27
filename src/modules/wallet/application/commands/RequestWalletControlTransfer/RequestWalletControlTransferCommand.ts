import { IsNotEmpty } from 'class-validator';

export class RequestWalletControlTransferCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  initiatorId: string;

  @IsNotEmpty()
  toHolderId: string;

  @IsNotEmpty()
  note: string;
}
