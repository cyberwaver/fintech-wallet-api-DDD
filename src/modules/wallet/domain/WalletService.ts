export class WalletService {
  constructor() {}

  async isUserAccountVerified(accountId: string): Promise<boolean> {
    return true;
  }

  async getWalletCreditSumByDate(date: Date): Promise<number> {
    return 0;
  }
  async getWalletDebitSumByDate(date: Date): Promise<number> {
    return 0;
  }
}
