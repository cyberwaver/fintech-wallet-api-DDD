import { IsNotEmpty } from 'class-validator';

export class SignWalletAssetTransferCommand {
  @IsNotEmpty()
  walletId: string;

  @IsNotEmpty()
  transferId: string;

  @IsNotEmpty()
  initiatorId: string;
}
