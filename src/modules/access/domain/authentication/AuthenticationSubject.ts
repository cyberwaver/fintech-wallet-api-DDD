import { ValueObject } from 'src/common/domain/ValueObject';

export class AuthenticationSubject extends ValueObject<string> {
  constructor(value: string | AuthenticationSubject) {
    super(typeof value == 'string' ? value.toUpperCase() : value);
  }

  public readonly IS_ACCESS = this.equals(AuthenticationSubject.Access);
  public readonly IS_REFRESH = this.equals(AuthenticationSubject.Refresh);
  public readonly IS_PASSWORD_RESET = this.equals(AuthenticationSubject.PasswordReset);

  public static readonly Access = new AuthenticationSubject('ACCESS');
  public static readonly Refresh = new AuthenticationSubject('REFRESH');
  public static readonly PasswordReset = new AuthenticationSubject('PASSWORD_RESET');
}
