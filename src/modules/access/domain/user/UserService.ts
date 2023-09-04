import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { AccountDetails, BVNDetails, IPspService } from 'src/common/infrastructure/IPspService';
import { IUsersRepository } from './IUsersRepository';

export class UserService {
  constructor(private usersRepo: IUsersRepository, private pspService: IPspService) {}

  public async isAccountVerified(userId: UniqueEntityID | string): Promise<boolean> {
    const result = await this.usersRepo.findById(userId);
    return result.IS_SUCCESS && result.value.status.IS_ACTIVE;
  }

  public async getBankAccountDetails(accountNo: string, bank: string): Promise<AccountDetails> {
    return this.pspService.getAccountDetails(accountNo, bank);
  }

  public async getBVNDetails(bvn: string): Promise<BVNDetails> {
    return this.pspService.getBVNDetails(bvn);
  }
}
