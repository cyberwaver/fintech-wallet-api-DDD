import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { BusinessStatus } from '../BusinessStatus';

export class BusinessShouldBePendingOnboarding extends BusinessRule {
  message = 'Business onboarding has already been completed.';
  constructor(private status: BusinessStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_PENDING;
  }
}
