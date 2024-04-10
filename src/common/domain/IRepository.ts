import { Result } from '@Common/utils/Result';
import { UniqueEntityID } from './UniqueEntityID';

export abstract class IRepository<A> {
  abstract recordExistsForFilter(filter: unknown): Promise<Result<boolean>>;
  abstract findById(id: UniqueEntityID | string): Promise<Result<A>>;
  abstract findByIds(ids: UniqueEntityID[] | string[]): Promise<Result<A[]>>;
  abstract findOne(filter: Record<string, unknown>): Promise<Result<A>>;
  abstract sync(aggregateRoot: A): Promise<Result<void>>;
}
