import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletHolderStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }
  public static Active(): WalletHolderStatus {
    return new WalletHolderStatus("ACTIVE");
  }
  public static Inactive(): WalletHolderStatus {
    return new WalletHolderStatus("INACTIVE");
  }
}
