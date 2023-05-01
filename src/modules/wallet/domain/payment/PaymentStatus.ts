import { ValueObject } from 'src/common/domain/ValueObject';

export class PaymentStatus extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }
  public static Pending = new PaymentStatus('PENDING');
  public static PendingWalletApproval = new PaymentStatus('PENDING_WALLET_APPROVAL');
  public static Failed = new PaymentStatus('FAILED');
  public static Success = new PaymentStatus('SUCCESS');
}
