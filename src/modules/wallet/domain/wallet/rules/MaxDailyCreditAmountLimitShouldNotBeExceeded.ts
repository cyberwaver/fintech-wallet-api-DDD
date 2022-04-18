import { BusinessRule } from "src/shared/domain/rule/BusinessRule";
import { WalletService } from "../../WalletService";
import { WalletProps } from "../Wallet";

export class MaxDailyCreditAmountLimitShouldNotBeExceeded extends BusinessRule {
  message = "Wallet maximum daily credit amount limit will be or has been exceeded";
  constructor(
    private wallet: WalletProps,
    private amount: number,
    private walletService: WalletService,
  ) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    const totalCreditAmountToday = await this.walletService.getWalletCreditSumByDate(new Date());
    return totalCreditAmountToday + this.amount > this.wallet.maxDailyCreditAmount;
  }
}
