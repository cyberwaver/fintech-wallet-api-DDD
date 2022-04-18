import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { ValueObject } from "src/shared/domain/ValueObject";

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
