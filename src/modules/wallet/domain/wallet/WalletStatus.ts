import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_ACTIVE = this.equals(WalletStatus.Active);
  public readonly IS_INACTIVE = this.equals(WalletStatus.Inactive);

  public static readonly Active = new WalletStatus('ACTIVE');
  public static readonly Inactive = new WalletStatus('INACTIVE');
}
