import { ValueObject } from "src/shared/domain/ValueObject";

export class PaymentType extends ValueObject<string> {
    constructor(value: string) {
        super(value.toUpperCase());
    }
    public static Inflow(): PaymentType {
        return new PaymentType("INFLOW")
    }
    public static Outflow(): PaymentType {
        return new PaymentType("INFLOW")
    }
}