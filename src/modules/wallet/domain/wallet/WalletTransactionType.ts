import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletTransactionType extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public readonly IS_DEBIT = this.equals(WalletTransactionType.Debit);
  public readonly IS_CREDIT = this.equals(WalletTransactionType.Credit);

  public static readonly Debit = new WalletTransactionType("DEBIT");
  public static readonly Credit = new WalletTransactionType("CREDIT");
}
