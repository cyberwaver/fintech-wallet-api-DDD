import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletBalance } from '../WalletBalance';

export class TxnAmountShouldNotExceedBalance extends BusinessRule {
  message = 'Debit amount is greater than wallet balance';
  constructor(private balance: WalletBalance, private amount: number) {
    super();
  }

  public isBroken(): boolean {
    return this.balance.isLessThan(this.amount);
  }
}
