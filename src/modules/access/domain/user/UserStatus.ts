import { ValueObject } from 'src/common/domain/ValueObject';

export class UserStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PENDING = this.equals(UserStatus.Pending);
  public readonly IS_VALIDATING = this.equals(UserStatus.Validating);
  public readonly IS_VALIDATION_FAILED = this.equals(UserStatus.ValidationFailed);
  public readonly IS_ACTIVE = this.equals(UserStatus.Active);
  public readonly IS_INACTIVE = this.equals(UserStatus.Inactive);

  public static readonly Pending = new UserStatus('PENDING');
  public static readonly Validating = new UserStatus('VALIDATING');
  public static readonly ValidationFailed = new UserStatus('VALIDATION_FAILED');
  public static readonly Active = new UserStatus('ACTIVE');
  public static readonly Inactive = new UserStatus('INACTIVE');
}
