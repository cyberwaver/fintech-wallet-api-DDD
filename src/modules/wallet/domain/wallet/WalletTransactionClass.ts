import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletTransactionClass extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public readonly IS_AUTH = this.equals(WalletTransactionClass.Auth);
  public readonly IS_AUTH_FINANCIAL = this.equals(WalletTransactionClass.AuthFinancial);
  public readonly IS_FINANCIAL = this.equals(WalletTransactionClass.Financial);
  public readonly IS_COMPLETION = this.equals(WalletTransactionClass.Settlement);
  public readonly IS_REVERSAL = this.equals(WalletTransactionClass.Reversal);

  public static readonly Auth = new WalletTransactionClass('AUTHORIZATION');
  public static readonly AuthFinancial = new WalletTransactionClass('AUTH_FINANCIAL');
  public static readonly Financial = new WalletTransactionClass('FINANCIAL');
  public static readonly Settlement = new WalletTransactionClass('SETTLEMENT');
  public static readonly Reversal = new WalletTransactionClass('REVERSAL');
}
