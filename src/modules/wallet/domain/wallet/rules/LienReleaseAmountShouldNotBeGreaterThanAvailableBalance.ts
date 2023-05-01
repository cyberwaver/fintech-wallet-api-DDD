import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletBalance } from '../WalletBalance';
import { WalletLien } from '../WalletLien';

export class LienReleaseAmountShouldNotBeGreaterThanAvailableBalance extends BusinessRule {
  message = 'Insufficient funds to resolve settlement.';
  constructor(
    private amount: number,
    private lien: WalletLien,
    private walletBalance: WalletBalance,
  ) {
    super();
  }

  public isBroken(): boolean {
    return this.amount > this.walletBalance.value + this.lien.amount;
  }
}
