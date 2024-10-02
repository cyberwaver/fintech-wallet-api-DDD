import { ValueObject } from 'src/common/domain/ValueObject';

export class AccountTier extends ValueObject<number> {
  constructor(value: number) {
    super(value);
  }

  public static readonly One = new AccountTier(1);
  public static readonly Two = new AccountTier(2);
  public static readonly Three = new AccountTier(3);
}
