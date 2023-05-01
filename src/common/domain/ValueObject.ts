/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export class ValueObject<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public static isAny(
    checkValue: ValueObject<unknown>,
    ...values: ValueObject<unknown>[]
  ): boolean {
    return values.some((v) => v.equals(checkValue));
  }

  public isAny(...values: ValueObject<T>[]): boolean {
    return ValueObject.isAny(this, ...values);
  }

  public equals(value: unknown | ValueObject<T>): boolean {
    if (!value) return false;
    // let val = value;
    // if(value instanceof ValueObject) val = value.value;
    return JSON.stringify(this.value) === JSON.stringify(value);
  }
}
