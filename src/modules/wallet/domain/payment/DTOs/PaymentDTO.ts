export class PaymentDTO {
    id?: string;
    amount: number;
    type: string;
    processedAt: Date;
    createdAt: Date;
    meta: object;
   }