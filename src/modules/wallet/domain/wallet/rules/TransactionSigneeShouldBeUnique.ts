import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletHolder } from '../WalletHolder';
import { WalletTransaction } from '../WalletTransaction';

export class TransactionSigneeShouldBeUnique extends BusinessRule {
  message = 'Wallet transaction can contain only unique signees';
  constructor(private transaction: WalletTransaction, private holder: WalletHolder) {
    super();
  }

  public isBroken(): boolean {
    return this.transaction.isASignee(this.holder);
  }
}
