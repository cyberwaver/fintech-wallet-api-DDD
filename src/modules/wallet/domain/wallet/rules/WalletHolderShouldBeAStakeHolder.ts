import { Amount } from 'src/common/domain/Amount';
import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletHolder } from '../WalletHolder';

export class WalletHolderShouldBeAStakeHolder extends BusinessRule {
  message = 'Wallet holder must be a stake holder.';
  constructor(private holder: WalletHolder) {
    super();
  }

  public isBroken(): boolean {
    return this.holder.stake.isLessThanOrEquals(Amount.Zero);
  }
}
