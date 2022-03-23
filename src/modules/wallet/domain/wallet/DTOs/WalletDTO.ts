export class WalletDTO {
    id?: string;
    name: string;
    number: string;
    ownerId: string;
    type: string;
    status: string;
    balance: number;
    createdAt: Date;
    meta: object;
   }