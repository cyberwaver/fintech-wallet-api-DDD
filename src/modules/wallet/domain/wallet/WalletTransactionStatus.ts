import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletTransactionStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }
  public static get Pending(): WalletTransactionStatus {
    return new WalletTransactionStatus("PENDING");
  }
  public static get Completed(): WalletTransactionStatus {
    return new WalletTransactionStatus("COMPLETED");
  }
}
