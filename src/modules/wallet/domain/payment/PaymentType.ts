import { ValueObject } from "src/shared/domain/ValueObject";

export class PaymentType extends ValueObject<string> {
    constructor(value: string) {
        super(value);
    }
    public static Inflow(): PaymentType {
        return new PaymentType("inflow")
    }
    public static Outflow(): PaymentType {
        return new PaymentType("outflow")
    }
}