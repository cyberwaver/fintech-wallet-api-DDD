import { IsNotEmpty } from "class-validator";

export class CompleteTransactionRequestDTO {
  @IsNotEmpty()
  walletId: string;
  @IsNotEmpty()
  transactionId: string;
}
