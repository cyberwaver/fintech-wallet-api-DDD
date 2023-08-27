import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { UserStatus } from '../UserStatus';

export class UserShouldBeActive extends BusinessRule {
  message = 'User is currently not active.';
  constructor(private status: UserStatus) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return !this.status.IS_ACTIVE;
  }
}
