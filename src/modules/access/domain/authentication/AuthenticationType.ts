import { ValueObject } from 'src/common/domain/ValueObject';

export class AuthenticationType extends ValueObject<string> {
  constructor(value: string | AuthenticationType) {
    super(typeof value == 'string' ? value.toUpperCase() : value);
  }

  public readonly IS_USER = this.equals(AuthenticationType.User);
  public readonly IS_INSTITUTION = this.equals(AuthenticationType.Institution);

  public static readonly User = new AuthenticationType('USER');
  public static readonly Institution = new AuthenticationType('INSTITUTION');
}
