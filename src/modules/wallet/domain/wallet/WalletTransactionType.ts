import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletTransactionType extends ValueObject<string> {
    constructor(value: string) {
        super(value);
    }
    public static Debit(): WalletTransactionType {
        return new WalletTransactionType("debit")
    }
    public static Credit(): WalletTransactionType {
        return new WalletTransactionType("credit")
    }
}