import { ValueObject } from "src/shared/domain/ValueObject";

export class WalletType extends ValueObject<string> {
    constructor(value: string) {
        super(value.toUpperCase());
    }
    public static Personal(): WalletType {
        return new WalletType("PERSONAL")
    }
    public static Enterprise(): WalletType {
        return new WalletType("ENTERPRISE")
    }
}