import { ValueObject } from 'src/common/domain/ValueObject';

export class BusinessStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PENDING = this.equals(BusinessStatus.Pending);
  public readonly IS_ACTIVE = this.equals(BusinessStatus.Active);
  public readonly IS_INACTIVE = this.equals(BusinessStatus.Inactive);

  public static readonly Pending = new BusinessStatus('PENDING');
  public static readonly Active = new BusinessStatus('ACTIVE');
  public static readonly Inactive = new BusinessStatus('INACTIVE');
}
