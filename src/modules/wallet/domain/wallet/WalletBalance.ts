import { ValueObject } from "src/shared/domain/ValueObject";
import { DomainValidationException } from "src/shared/exceptions/DomainValidationException";

export class WalletBalance extends ValueObject<number> {
  constructor(amount: number) {
    super(amount);
  }

  public isGreaterThanOrEquals(amount: number): boolean {
    return this.value >= amount;
  }

  public isLessThan(amount: number): boolean {
    return !this.isGreaterThanOrEquals(amount);
  }

  public add(amount: number): WalletBalance {
    return new WalletBalance(this.value + amount);
  }

  public subtract(amount: number): WalletBalance {
    if (this.isLessThan(amount)) {
      throw new DomainValidationException("Balance is less than amount to be subtracted");
    }
    return new WalletBalance(this.value - amount);
  }
}
