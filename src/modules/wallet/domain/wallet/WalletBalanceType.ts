import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletBalanceType extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_CURRENT = this.equals(WalletBalanceType.Current);
  public readonly IS_AVAILABLE = this.equals(WalletBalanceType.Available);
  public readonly IS_LEDGER = this.equals(WalletBalanceType.Ledger);

  public static readonly Current = new WalletBalanceType('CURRENT');
  public static readonly Available = new WalletBalanceType('AVAILABLE');
  public static readonly Ledger = new WalletBalanceType('LEDGER');
}
