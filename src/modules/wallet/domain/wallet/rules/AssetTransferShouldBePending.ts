import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletAssetTransfer } from '../WalletAssetTransfer';

export class AssetTransferShouldBePending extends BusinessRule {
  message = 'Asset transfer request is not pending processing';
  constructor(private transfer: WalletAssetTransfer) {
    super();
  }

  public isBroken(): boolean {
    return !this.transfer.status.IS_PENDING;
  }
}
