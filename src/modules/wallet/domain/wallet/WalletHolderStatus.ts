import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletHolderStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_ACTIVE = this.equals(WalletHolderStatus.Active);
  public readonly IS_INACTIVE = this.equals(WalletHolderStatus.Inactive);

  public static readonly Active = new WalletHolderStatus("ACTIVE");
  public static readonly Inactive = new WalletHolderStatus("INACTIVE");
}
