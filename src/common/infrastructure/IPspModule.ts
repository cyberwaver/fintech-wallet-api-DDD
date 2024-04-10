import { AccountDetails } from './IPspService';

export interface IPspModule {
  getAccountDetails(accountNo: string, bank: string): Promise<AccountDetails>;
}
