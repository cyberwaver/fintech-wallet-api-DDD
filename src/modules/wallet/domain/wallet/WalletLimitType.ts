import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletLimitType extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PER_TXN = this.equals(WalletLimitType.PerTxn);
  public readonly IS_DAILY = this.equals(WalletLimitType.Daily);
  public readonly IS_WEEKLY = this.equals(WalletLimitType.Weekly);
  public readonly IS_MONTHLY = this.equals(WalletLimitType.Monthly);

  public static PerTxn = new WalletLimitType('TRANSACTION');
  public static Daily = new WalletLimitType('DAILY');
  public static Weekly = new WalletLimitType('WEEKLY');
  public static Monthly = new WalletLimitType('MONTHLY');
}
