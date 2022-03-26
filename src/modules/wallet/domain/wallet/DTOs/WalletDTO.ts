export class WalletDTO {
    id?: string;
    name: string;
    number: string;
    type: string;
    status: string;
    balance: number;
    minTxnApprovals: number;
    createdAt: Date;
    meta: object;
   }