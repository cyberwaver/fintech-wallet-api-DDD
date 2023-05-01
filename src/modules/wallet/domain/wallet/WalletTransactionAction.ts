import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletTransactionAction extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public readonly IS_DEBIT = this.equals(WalletTransactionAction.Debit);
  public readonly IS_CREDIT = this.equals(WalletTransactionAction.Credit);

  public static readonly Debit = new WalletTransactionAction('DEBIT');
  public static readonly Credit = new WalletTransactionAction('CREDIT');
}
