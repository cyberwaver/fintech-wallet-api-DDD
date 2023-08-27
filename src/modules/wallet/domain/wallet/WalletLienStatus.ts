import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletLienStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_ACTIVE = this.equals(WalletLienStatus.Active);
  public readonly IS_RELEASED = this.equals(WalletLienStatus.Released);
  public readonly IS_PARTIALLY_RELEASED = this.equals(WalletLienStatus.PartiallyReleased);
  public readonly IS_EXTINGUISHED = this.equals(WalletLienStatus.Extinguished);

  public static readonly Active = new WalletLienStatus('ACTIVE');
  public static readonly Released = new WalletLienStatus('RELEASED');
  public static readonly PartiallyReleased = new WalletLienStatus('PARTIALLY_RELEASED');
  public static readonly Extinguished = new WalletLienStatus('EXTINGUISHED');
}
