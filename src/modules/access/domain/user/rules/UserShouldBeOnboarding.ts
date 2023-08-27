import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { UserStatus } from '../UserStatus';

export class UserShouldBeOnboarding extends BusinessRule {
  message = 'User onboarding has already been completed.';
  constructor(private status: UserStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_PENDING;
  }
}
