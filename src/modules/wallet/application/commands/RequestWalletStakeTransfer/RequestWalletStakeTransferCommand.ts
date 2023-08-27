import { IsNotEmpty } from 'class-validator';

export class RequestWalletStakeTransferCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  initiatorId: string;

  @IsNotEmpty()
  fromHolderId: string;

  @IsNotEmpty()
  toHolderId: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  note: string;
}
