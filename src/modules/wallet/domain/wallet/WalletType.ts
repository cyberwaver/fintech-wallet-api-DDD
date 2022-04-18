import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletType extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }
  public static Personal = new WalletType("PERSONAL");
  public static Shared = new WalletType("SHARED");
}
