import { ValueObject } from 'src/common/domain/ValueObject';
import { WalletTransactionAction } from './WalletTransactionAction';

export class WalletTransactionType extends ValueObject<string> {
  private _action = WalletTransactionAction.Debit;
  constructor(value: string) {
    super(value);
    this.setAction();
  }

  public get action(): WalletTransactionAction {
    return this._action;
  }

  public readonly IS_DEPOSIT = this.equals(WalletTransactionType.Deposit);
  public readonly IS_WITHDRAWAL = this.equals(WalletTransactionType.Withdrawal);
  public readonly IS_TRANSFER_FROM = this.equals(WalletTransactionType.TransferFrom);
  public readonly IS_TRANSFER_TO = this.equals(WalletTransactionType.TransferTo);
  public readonly IS_PURCHASE = this.equals(WalletTransactionType.Purchase);
  public readonly IS_REFUND_FROM = this.equals(WalletTransactionType.RefundFrom);
  public readonly IS_REFUND_TO = this.equals(WalletTransactionType.RefundTo);
  public readonly IS_CASHBACK = this.equals(WalletTransactionType.Cashback);

  private setAction(): void {
    const { Deposit, TransferTo, RefundTo, Cashback } = WalletTransactionType;
    if (this.isAny(Deposit, TransferTo, RefundTo, Cashback)) {
      this._action = WalletTransactionAction.Credit;
    }
  }

  public static readonly Deposit = new WalletTransactionType('DEPOSIT');
  public static readonly Withdrawal = new WalletTransactionType('WITHDRAWAL');
  public static readonly TransferFrom = new WalletTransactionType('TRANSFER_FROM');
  public static readonly TransferTo = new WalletTransactionType('TRANSFER_TO');
  public static readonly Purchase = new WalletTransactionType('PURCHASE');
  public static readonly RefundFrom = new WalletTransactionType('REFUND_FROM');
  public static readonly RefundTo = new WalletTransactionType('REFUND_TO');
  public static readonly Cashback = new WalletTransactionType('CASHBACK');
}
