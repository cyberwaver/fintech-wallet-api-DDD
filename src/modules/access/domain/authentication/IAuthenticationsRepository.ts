import { IRepository } from 'src/common/domain/IRepository';
import { Authentication } from './Authentication';

export interface IAuthenticationsRepository extends IRepository<Authentication> {
  findOneByEmailAndType(email: string, type: string): Promise<Authentication>;
  authExists(email: string, type: string): Promise<boolean>;
}
