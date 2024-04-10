import { IRepository } from '@Common/domain/IRepository';
import { Authentication } from './Authentication';
import { Result } from '@Common/utils/Result';

export abstract class IAuthenticationsRepository extends IRepository<Authentication> {
  abstract findOneByEmailAndType(email: string, type: string): Promise<Result<Authentication>>;
  abstract authExists(email: string, type: string): Promise<Result<boolean>>;
}
