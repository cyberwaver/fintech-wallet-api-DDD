import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletAssetType extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public readonly IS_BALANCE = this.equals(WalletAssetType.Balance);
  public readonly IS_STAKE = this.equals(WalletAssetType.Stake);
  public readonly IS_CONTROL = this.equals(WalletAssetType.Control);

  public static readonly Balance = new WalletAssetType('Balance');
  public static readonly Stake = new WalletAssetType('STAKE');
  public static readonly Control = new WalletAssetType('CONTROL');
}
