import { IsNotEmpty } from "class-validator";

export class SignTransactionRequestDTO {
  @IsNotEmpty()
  walletId: string;
  @IsNotEmpty()
  holderId: string;
  @IsNotEmpty()
  transactionId: string;
}
