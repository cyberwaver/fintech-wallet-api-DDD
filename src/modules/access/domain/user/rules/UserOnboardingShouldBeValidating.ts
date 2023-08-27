import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { UserStatus } from '../UserStatus';

export class UserOnboardingShouldBeValidating extends BusinessRule {
  message = 'User onboarding is not under validation';
  constructor(private status: UserStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_VALIDATING;
  }
}
