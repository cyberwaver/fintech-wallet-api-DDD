import { Amount } from 'src/common/domain/Amount';
import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletBalance } from '../WalletBalance';

export class AmountShouldNotExceedBalance extends BusinessRule {
  message = 'Debit amount is greater than wallet balance';
  constructor(private balance: WalletBalance, private amount: Amount) {
    super();
  }

  public isBroken(): boolean {
    return this.balance.isLessThan(this.amount);
  }
}
