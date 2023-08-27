import { DomainValidationException } from '../exceptions/DomainValidationException';
import { ValueObject } from './ValueObject';

export class Amount extends ValueObject<number> {
  constructor(value: Amount | number) {
    super(value);
  }

  public isGreaterThanOrEquals(amount: Amount | number): boolean {
    return this.value >= new Amount(amount).value;
  }

  public isLessThanOrEquals(amount: Amount | number): boolean {
    return this.value <= new Amount(amount).value;
  }

  public isLessThan(amount: Amount | number): boolean {
    return !this.isGreaterThanOrEquals(amount);
  }

  public isGreaterThan(amount: Amount | number): boolean {
    return this.value > new Amount(amount).value;
  }

  public equals(amount: Amount | number): boolean {
    return this.value == new Amount(amount).value;
  }

  public add(amount: Amount | number): Amount {
    return new Amount(this.value + new Amount(amount).value);
  }

  public subtract(amount: Amount | number): Amount {
    return new Amount(this.value - new Amount(amount).value);
  }

  public static Zero = new Amount(0);
  public static Infinity = new Amount(Infinity);

  public static create(number: number | string): Amount {
    number = Number(number);
    if (Number.isNaN(number))
      throw new DomainValidationException('Amount should be a valid number.');
    if (number < 0) throw new DomainValidationException('Amount cannot be less than 0');
    return new Amount(number);
  }
}
