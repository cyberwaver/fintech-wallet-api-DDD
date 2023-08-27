import { Amount } from 'src/common/domain/Amount';
import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletHolder } from '../WalletHolder';

export class AssetTransferShouldBeSignedWithUnusedStake extends BusinessRule {
  message = 'Asset transfer request can only be signed with unused available stake.';
  constructor(private holder: WalletHolder) {
    super();
  }

  public isBroken(): boolean {
    return this.holder.stake.isLessThan(Amount.Zero);
  }
}
