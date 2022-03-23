import { ValueObject } from "src/shared/domain/ValueObject";

export class TransactionType extends ValueObject<string> {
    constructor(value: string) {
        super(value);
    }
    public static Debit(): TransactionType {
        return new TransactionType("debit")
    }
    public static Credit(): TransactionType {
        return new TransactionType("credit")
    }
}