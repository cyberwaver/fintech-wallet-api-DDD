export class WalletService {
  constructor() {}

  async isUserAccountVerified(accountId: string): Promise<boolean> {
    return true;
  }
}
