import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { ValueObject } from 'src/common/domain/ValueObject';
import { WalletHolder } from './WalletHolder';

type WalletSigneeValue = {
  holderId: UniqueEntityID;
  stake: number;
  signedAt?: Date;
};

export class WalletSignee extends ValueObject<WalletSigneeValue> {
  constructor(value: WalletSigneeValue) {
    value.signedAt = new Date();
    super(value);
  }

  public isHolder(holderId: UniqueEntityID): boolean {
    return this.value.holderId.equals(holderId);
  }

  public static of(holder: WalletHolder, stake): WalletSignee {
    return new WalletSignee({ holderId: holder.ID, stake });
  }
}
