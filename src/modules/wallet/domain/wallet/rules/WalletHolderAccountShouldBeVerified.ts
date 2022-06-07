import { BusinessRule } from "src/shared/domain/rule/BusinessRule";
import { WalletService } from "../../WalletService";

export class WalletHolderAccountShouldBeVerified extends BusinessRule {
  message = "Wallet holder account has not been verified";
  constructor(private accountId: string, private walletService: WalletService) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    const accountIsVerified = await this.walletService.isUserAccountVerified(this.accountId);
    return accountIsVerified ? false : true;
  }
}
