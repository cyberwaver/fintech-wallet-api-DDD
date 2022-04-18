import { WalletHolderDTO } from "./WalletHolderDTO";
import { WalletTransactionDTO } from "./WalletTransactionDTO";

export class WalletDTO {
  id: string;
  name: string;
  number: string;
  type: string;
  status: string;
  balance: number;
  maxDailyCreditAmount: number;
  maxDailyDebitAmount: number;
  minTxnSignees: number;
  holders: WalletHolderDTO[];
  transactions: WalletTransactionDTO[];
  createdAt: Date;
  meta: object;
}
