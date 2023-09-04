export class Identifier<T> {
  constructor(private _value: T) {}

  equals(id?: Identifier<T> | unknown): boolean {
    let val = id;
    if (id instanceof Identifier) val = id.toString();
    return this.toString() == val;
  }

  toString() {
    return String(this.value);
  }

  get value(): T {
    return this._value;
  }

  toJSON() {
    return this.value;
  }
}
