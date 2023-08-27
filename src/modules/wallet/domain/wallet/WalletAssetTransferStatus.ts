import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletAssetTransferStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PENDING = this.equals(WalletAssetTransferStatus.Pending);
  public readonly IS_COMPLETED = this.equals(WalletAssetTransferStatus.Completed);

  public static readonly Pending = new WalletAssetTransferStatus('PENDING');
  public static readonly Completed = new WalletAssetTransferStatus('COMPLETED');
}
