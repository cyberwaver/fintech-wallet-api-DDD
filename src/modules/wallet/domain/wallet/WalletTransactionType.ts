import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletTransactionType extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public readonly IS_AUTH = this.equals(WalletTransactionType.Auth);
  public readonly IS_FINANCIAL = this.equals(WalletTransactionType.Financial);
  public readonly IS_SETTLEMENT = this.equals(WalletTransactionType.Settlement);
  public readonly IS_REVERSAL = this.equals(WalletTransactionType.Reversal);

  public static readonly Auth = new WalletTransactionType('AUTHORIZATION');
  public static readonly Financial = new WalletTransactionType('FINANCIAL');
  public static readonly Settlement = new WalletTransactionType('SETTLEMENT');
  public static readonly Reversal = new WalletTransactionType('REVERSAL');
}
