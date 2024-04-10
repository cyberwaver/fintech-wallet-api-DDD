import { Result } from '@Common/utils/Result';
import { AggregateRoot } from '../domain/AggregateRoot';
import { UniqueEntityID } from '../domain/UniqueEntityID';
import { IRepository } from '@Common/domain/IRepository';

export abstract class IPersistenceManager {
  abstract getRepository<T extends { id: UniqueEntityID }>(
    aggregateRoot: typeof AggregateRoot<T>,
  ): IRepository<AggregateRoot<T>>;
  abstract flush<T extends { id: UniqueEntityID }>(
    ...aggregateRoots: AggregateRoot<T>[]
  ): Promise<Result<void, Error>>;
}
