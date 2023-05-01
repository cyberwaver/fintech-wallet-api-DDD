import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletService } from '../../WalletService';
import { WalletProps } from '../Wallet';

export class MaxDailyDebitAmountLimitShouldNotBeExceeded extends BusinessRule {
  message = 'Wallet maximum daily debit amount limit will be or has been exceeded';
  constructor(
    private wallet: WalletProps,
    private amount: number,
    private walletService: WalletService,
  ) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    const totalDebitAmountToday = await this.walletService.getWalletDebitSumByDate(new Date());
    return totalDebitAmountToday + this.amount > this.wallet.maxDailyDebitAmount;
  }
}
