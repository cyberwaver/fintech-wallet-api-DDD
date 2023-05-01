import { ValueObject } from 'src/common/domain/ValueObject';

export class PaymentType extends ValueObject<string> {
  constructor(value: string) {
    super(value.toUpperCase());
  }

  public readonly IS_TOPUP = this.equals(PaymentType.TopUp);
  public readonly IS_TRANSFER = this.equals(PaymentType.Transfer);
  public readonly IS_WITHDRAWAL = this.equals(PaymentType.Withdrawal);

  public static TopUp = new PaymentType('TOPUP');
  public static Transfer = new PaymentType('TRANSFER');
  public static Withdrawal = new PaymentType('WITHDRAWAL');
}
