import { IPspModule } from './modules/IPspModule';

export interface IPspService {
  getAccountDetails(
    accountNo: string,
    bank: string,
    provider?: IPspModule,
  ): Promise<AccountDetails>;
  getBVNDetails(bvn: string, provider?: IPspModule): Promise<BVNDetails>;
}

export type AccountDetails = {
  accountNo: string;
  accountName: string;
  bankName: string;
};

export type BVNDetails = {
  firstName: string;
  middleName: string;
  lastName: string;
  bvn: string;
};
