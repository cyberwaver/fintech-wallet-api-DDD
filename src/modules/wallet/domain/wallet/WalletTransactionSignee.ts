import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { ValueObject } from 'src/common/domain/ValueObject';

class WalletTransactionSigneeValue {
  holderId: string;
  signedAt?: Date;
}

export class WalletTransactionSignee extends ValueObject<WalletTransactionSigneeValue> {
  constructor(value: WalletTransactionSigneeValue) {
    value.signedAt = new Date();
    super(value);
  }
}
