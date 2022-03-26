import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletStatus extends ValueObject<string> {
    constructor(value: string) {
        super(value.toUpperCase());
    }
    public static Active(): WalletStatus {
        return new WalletStatus("ACTIVE")
    }
    public static Inactive(): WalletStatus {
        return new WalletStatus("INACTIVE")
    }
}