import { IsIn, IsNotEmpty } from "class-validator";

export class NewWalletTransactionDTO {
    @IsNotEmpty()
    walletId: string;
    @IsIn(["CREDIT", "DEBIT"])
    type: string;
    @IsNotEmpty()
    amount: string;
}