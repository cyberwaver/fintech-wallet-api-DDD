import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { AuthenticationService } from '../AuthenticationService';
import { AuthenticationType } from '../AuthenticationType';

export class AuthEmailShouldBeUniquePerType extends BusinessRule {
  message = 'Authentication exists for email.';
  constructor(
    private email: string,
    private type: AuthenticationType | string,
    private authService: AuthenticationService,
  ) {
    super();
  }

  public async isBroken(): Promise<boolean> {
    return this.authService.authExists(this.email, new AuthenticationType(this.type));
  }
}
