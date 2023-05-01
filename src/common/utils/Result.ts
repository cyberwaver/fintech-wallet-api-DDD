class Result<T, E = Error> {
  constructor(public isSuccess: boolean, public _error: E, public _value: T) {
    if (isSuccess && _error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !_error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }
    Object.freeze(this);
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
    }

    return this._value;
  }

  get error(): E {
    return this.error;
  }

  static ok<T>(value: T): Result<T, null> {
    return new Result(true, null, value);
  }

  static fail<E>(error: E): Result<null, E> {
    return new Result(false, error, null);
  }

  public static async resolve<T>(task: Promise<T>): Promise<Result<T>> {
    try {
      const res = await Promise.resolve(task);
      return Result.ok(res);
    } catch (err) {
      return Result.fail(err);
    }
  }

  public static async handle<T>(func: () => Promise<T>): Promise<Result<T>> {
    return Result.resolve(func.call(null));
  }

  public static handleSync<T>(func: () => T): Result<T> {
    try {
      return Result.ok(func.call(null));
    } catch (err) {
      return Result.fail(err);
    }
  }

  public static combine(results: Result<any>[]): Result<null> {
    for (const result of results) {
      if (!result.isSuccess) return Result.fail(result.error);
    }
    return Result.ok(null);
  }
}

module.exports = { Result };
