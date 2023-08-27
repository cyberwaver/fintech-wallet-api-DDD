import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletType } from '../WalletType';

export class WalletSharedTypeOnlyAllowed extends BusinessRule {
  message = 'Wallet shared type only is allowed for this operation';
  constructor(private type: WalletType) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.type.IS_SHARED;
  }
}
