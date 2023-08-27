import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletTransactionType } from '../WalletTransactionType';
import { Wallet } from '../Wallet';
import { WalletLimit } from '../WalletLimit';
import { Amount } from 'src/common/domain/Amount';

export class TransactionTypeAmountLimitShouldNotBeExceeded extends BusinessRule {
  message = '';
  constructor(
    private amount: Amount,
    private txnType: WalletTransactionType,
    private wallet: Wallet,
  ) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    const limitType = this.wallet.getAmountLimitExceededType(this.amount, this.txnType);
    if (!limitType) return false;
    this.message = WalletLimit.TABLE[limitType.value][this.txnType.value].amountMessage;
    return true;
  }
}
