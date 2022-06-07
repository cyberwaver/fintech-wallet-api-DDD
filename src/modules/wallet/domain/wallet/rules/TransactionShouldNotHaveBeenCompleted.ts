import { BusinessRule } from "src/shared/domain/rule/BusinessRule";
import { WalletTransaction } from "../WalletTransaction";

export class TransactionShouldNotHaveBeenCompleted extends BusinessRule {
  message = "Wallet transaction has been completed";
  constructor(private transaction: WalletTransaction) {
    super();
  }

  public isBroken(): boolean {
    return this.transaction.status.IS_COMPLETED;
  }
}
