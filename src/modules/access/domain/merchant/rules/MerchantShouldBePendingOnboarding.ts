import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { MerchantStatus } from '../MerchantStatus';

export class MerchantShouldBePendingOnboarding extends BusinessRule {
  message = 'Merchant onboarding has already been completed.';
  constructor(private status: MerchantStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_PENDING;
  }
}
