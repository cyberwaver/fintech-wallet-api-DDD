import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletTransactionType } from '../WalletTransactionType';
import { Wallet } from '../Wallet';
import { WalletLimit } from '../WalletLimit';

export class TransactionTypeCountLimitShouldNotBeExceeded extends BusinessRule {
  message = '';
  constructor(private txnType: WalletTransactionType, private wallet: Wallet) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    const limitType = this.wallet.getCountLimitExceededType(this.txnType);
    if (!limitType) return false;
    this.message = WalletLimit.TABLE[limitType.value][this.txnType.value].countMessage;
    return true;
  }
}
