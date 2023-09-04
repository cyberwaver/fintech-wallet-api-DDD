import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletAuthHold } from '../WalletAuthHold';

export class WalletAuthHoldShouldBeActive extends BusinessRule {
  message = 'Wallet authorization hold is not active.';
  constructor(private lien: WalletAuthHold) {
    super();
  }

  public isBroken(): boolean {
    return !this.lien.status.IS_ACTIVE;
  }
}
