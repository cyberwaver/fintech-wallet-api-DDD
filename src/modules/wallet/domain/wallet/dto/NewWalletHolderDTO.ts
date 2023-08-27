import { IsNotEmpty } from "class-validator";

export class NewWalletHolderDTO {
    @IsNotEmpty()
    walletId: string;
    @IsNotEmpty()
    accountId: string;
}