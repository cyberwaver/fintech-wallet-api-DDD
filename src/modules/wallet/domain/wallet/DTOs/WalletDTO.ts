import { WalletHolderDTO } from "./WalletHolderDTO";
import { WalletTransactionDTO } from "./WalletTransactionDTO";

export class WalletDTO {
  id?: string;
  name: string;
  number: string;
  type: string;
  status: string;
  balance: number;
  minFundAmount: number;
  maxFundAmount: number;
  maxDailyFundAmount: number;
  minTxnApprovals: number;
  holders: WalletHolderDTO[];
  transactions: WalletTransactionDTO[];
  createdAt: Date;
  meta: object;
}
