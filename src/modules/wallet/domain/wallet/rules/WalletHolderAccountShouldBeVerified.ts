import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { WalletService } from '../../WalletService';

export class WalletHolderAccountShouldBeVerified extends BusinessRule {
  message = 'Wallet holder account has not been verified';
  constructor(private accountId: UniqueEntityID, private walletService: WalletService) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    const accountIsVerified = await this.walletService.isUserVerified(this.accountId);
    return !accountIsVerified;
  }
}
