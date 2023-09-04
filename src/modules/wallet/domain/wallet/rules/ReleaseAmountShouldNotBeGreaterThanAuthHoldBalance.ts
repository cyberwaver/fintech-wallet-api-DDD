import { Amount } from 'src/common/domain/Amount';
import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletAuthHold } from '../WalletAuthHold';

export class ReleaseAmountShouldNotBeGreaterThanAuthHoldBalance extends BusinessRule {
  message = 'Release amount is greater than reserved (hold) balance.';
  constructor(private amount: Amount, private hold: WalletAuthHold) {
    super();
  }

  public isBroken(): boolean {
    return !this.hold.isAmountReleasable(this.amount);
  }
}
