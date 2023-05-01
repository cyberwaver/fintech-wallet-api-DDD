import { ValueObject } from 'src/common/domain/ValueObject';

export class WalletTransactionStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_PENDING = this.equals(WalletTransactionStatus.Pending);
  public readonly IS_COMPLETED = this.equals(WalletTransactionStatus.Completed);

  public static readonly Pending = new WalletTransactionStatus('PENDING');
  public static readonly Completed = new WalletTransactionStatus('COMPLETED');
}
