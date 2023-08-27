import { IRepository } from 'src/common/domain/IRepository';
import { Merchant } from './Merchant';

export interface IMerchantsRepository extends IRepository<Merchant> {
  anyExistsWithKeyPrefix(prefix: string): Promise<boolean>;
}
