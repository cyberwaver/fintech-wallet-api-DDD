import { Amount } from 'src/common/domain/Amount';
import { BusinessRule } from 'src/common/domain/rule/BusinessRule';

export class AmountShouldNotExceedHolderStakeBalance extends BusinessRule {
  message = "Stake amount is greater than holder's stake balance.";
  constructor(private balance: Amount, private amount: Amount) {
    super();
  }

  public isBroken(): boolean {
    return this.balance.isLessThan(this.amount);
  }
}
