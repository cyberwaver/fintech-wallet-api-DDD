import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletTransactionType extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
  public static get Debit(): WalletTransactionType {
    return new WalletTransactionType("DEBIT");
  }
  public static get Credit(): WalletTransactionType {
    return new WalletTransactionType("CREDIT");
  }
}
