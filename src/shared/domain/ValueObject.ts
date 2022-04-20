/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public equals(valueObj?: ValueObject<T>): boolean {
    if (!valueObj) return false;
    return JSON.stringify(this.value) === JSON.stringify(valueObj.value);
  }
}
