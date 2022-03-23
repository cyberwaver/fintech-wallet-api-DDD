import { IsNotEmpty, IsNumber } from "class-validator";

export class NewPaymentDTO {
    @IsNotEmpty()
    paymentId: string;

    @IsNumber()
    amount: number;

    @IsNotEmpty()
    type: string;

    meta: object;
   }