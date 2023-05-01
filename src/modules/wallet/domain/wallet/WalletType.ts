import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletType extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PERSONAL = this.equals(WalletType.Personal);
  public readonly IS_SHARED = this.equals(WalletType.Shared);

  public static Personal = new WalletType('PERSONAL');
  public static Shared = new WalletType('SHARED');
}
