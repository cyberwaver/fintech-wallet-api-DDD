import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletAuthHoldStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PENDING = this.equals(WalletAuthHoldStatus.Pending);
  public readonly IS_RELEASED = this.equals(WalletAuthHoldStatus.Released);
  public readonly IS_PARTIALLY_RELEASED = this.equals(WalletAuthHoldStatus.PartiallyReleased);
  public readonly IS_VOIDED = this.equals(WalletAuthHoldStatus.Voided);
  public readonly IS_EXPIRED = this.equals(WalletAuthHoldStatus.Expired);
  public readonly IS_ACTIVE = this.isAny(
    WalletAuthHoldStatus.Pending,
    WalletAuthHoldStatus.PartiallyReleased,
  );

  public static readonly Pending = new WalletAuthHoldStatus('PENDING');
  public static readonly Released = new WalletAuthHoldStatus('RELEASED');
  public static readonly PartiallyReleased = new WalletAuthHoldStatus('PARTIALLY_RELEASED');
  public static readonly Voided = new WalletAuthHoldStatus('VOIDED');
  public static readonly Expired = new WalletAuthHoldStatus('EXPIRED');
}
