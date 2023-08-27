import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletAssetTransfer } from '../WalletAssetTransfer';

export class AssetTransferShouldHaveReachedSetThreshold extends BusinessRule {
  message = 'Asset transfer signed stakes threshold not yet reached.';
  constructor(private transfer: WalletAssetTransfer) {
    super();
  }

  public isBroken(): boolean {
    return !this.transfer.STAKE_THRESHOLD_REACHED;
  }
}
