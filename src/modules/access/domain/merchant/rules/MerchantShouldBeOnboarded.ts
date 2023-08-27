import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { MerchantStatus } from '../MerchantStatus';

export class MerchantShouldBeOnboarded extends BusinessRule {
  message = 'Merchant onboarding not completed.';
  constructor(private status: MerchantStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return this.status.IS_PENDING;
  }
}
