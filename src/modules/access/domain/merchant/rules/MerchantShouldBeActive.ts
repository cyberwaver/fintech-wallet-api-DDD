import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { MerchantStatus } from '../MerchantStatus';

export class MerchantShouldBeActive extends BusinessRule {
  message = 'Merchant is currently not active.';
  constructor(private status: MerchantStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_ACTIVE;
  }
}
