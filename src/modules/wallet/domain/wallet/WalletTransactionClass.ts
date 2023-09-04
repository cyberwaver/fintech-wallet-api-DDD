import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletTransactionClass extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public readonly IS_AUTH = this.equals(WalletTransactionClass.Auth);
  public readonly IS_AUTH_ADV = this.equals(WalletTransactionClass.AuthAdv);
  public readonly IS_FINANCIAL = this.equals(WalletTransactionClass.Financial);
  public readonly IS_FINANCIAL_ADV = this.equals(WalletTransactionClass.FinancialAdv);
  public readonly IS_REVERSAL = this.equals(WalletTransactionClass.Reversal);
  public readonly IS_REVERSAL_ADV = this.equals(WalletTransactionClass.ReversalAdv);

  public static readonly Auth = new WalletTransactionClass('AUTHORIZATION');
  public static readonly AuthAdv = new WalletTransactionClass('AUTHORIZATION_ADVICE');
  public static readonly Financial = new WalletTransactionClass('FINANCIAL');
  public static readonly FinancialAdv = new WalletTransactionClass('FINANCIAL_ADVICE');
  public static readonly Reversal = new WalletTransactionClass('REVERSAL');
  public static readonly ReversalAdv = new WalletTransactionClass('REVERSAL_ADVICE');
}
