import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletService } from '../../WalletService';
import { WalletProps } from '../Wallet';
import { WalletTransaction } from '../WalletTransaction';

export class WalletTxnShouldBeSignedByMinNumOfHolders extends BusinessRule {
  message = 'Wallet transaction has not been signed by the set minimum number of holders';
  constructor(private wallet: WalletProps, private transaction: WalletTransaction) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return this.transaction.SIGNEES_COUNT < this.wallet.minTxnSignees;
  }
}
