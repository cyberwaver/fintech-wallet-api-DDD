import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { BusinessStatus } from '../BusinessStatus';

export class BusinessShouldBeInactive extends BusinessRule {
  message = 'Business is currently not inactive.';
  constructor(private status: BusinessStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_INACTIVE;
  }
}
