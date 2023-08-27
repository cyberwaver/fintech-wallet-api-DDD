import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletAssetTransfer } from '../WalletAssetTransfer';
import { WalletHolder } from '../WalletHolder';

export class AssetTransferSigneeShouldBeUnique extends BusinessRule {
  message = 'Asset transfer request has already been signed by holder';
  constructor(private transfer: WalletAssetTransfer, private holder: WalletHolder) {
    super();
  }

  public isBroken(): boolean {
    return this.transfer.holderHasSigned(this.holder.ID);
  }
}
