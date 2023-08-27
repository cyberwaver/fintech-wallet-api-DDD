import { ValueObject } from 'src/common/domain/ValueObject';

export class MerchantStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PENDING = this.equals(MerchantStatus.Pending);
  public readonly IS_ACTIVE = this.equals(MerchantStatus.Active);
  public readonly IS_INACTIVE = this.equals(MerchantStatus.Inactive);

  public static readonly Pending = new MerchantStatus('PENDING');
  public static readonly Active = new MerchantStatus('ACTIVE');
  public static readonly Inactive = new MerchantStatus('INACTIVE');
}
