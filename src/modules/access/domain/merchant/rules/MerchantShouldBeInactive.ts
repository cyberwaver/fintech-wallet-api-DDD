import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { MerchantStatus } from '../MerchantStatus';

export class MerchantShouldBeInactive extends BusinessRule {
  message = 'Merchant is currently not inactive.';
  constructor(private status: MerchantStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_INACTIVE;
  }
}
