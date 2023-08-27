import { IRepository } from 'src/common/domain/IRepository';
import { Business } from './Business';

export interface IBusinessesRepository extends IRepository<Business> {
  anyExistsWithKeyPrefix(prefix: string): Promise<boolean>;
}
