import { Amount } from 'src/common/domain/Amount';
import { DomainValidationException } from 'src/common/exceptions/DomainValidationException';

export class WalletBalance extends Amount {
  constructor(amount: number | Amount) {
    super(amount);
  }

  public add(amount: Amount): WalletBalance {
    return new WalletBalance(this.add(amount));
  }

  public subtract(amount: Amount): WalletBalance {
    if (this.isLessThan(amount)) {
      throw new DomainValidationException('Balance is less than amount to be subtracted');
    }
    return new WalletBalance(this.value - amount.value);
  }
}
