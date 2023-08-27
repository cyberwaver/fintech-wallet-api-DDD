import { IRepository } from 'src/common/domain/IRepository';
import { User } from './User';

export interface IUsersRepository extends IRepository<User> {
  anyExistsWithKeyPrefix(prefix: string): Promise<boolean>;
}
