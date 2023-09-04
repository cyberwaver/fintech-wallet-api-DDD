import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { UserService } from 'src/modules/access/domain/user/UserService';

export class WalletService {
  constructor(private userService: UserService) {}

  async isUserVerified(accountId: UniqueEntityID): Promise<boolean> {
    return this.userService.isAccountVerified(accountId);
  }
}
