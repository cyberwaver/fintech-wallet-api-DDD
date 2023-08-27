import { AggregateRoot } from '../domain/AggregateRoot';
import { UniqueEntityID } from '../domain/UniqueEntityID';

export interface IRepositoryManager {
  save<T extends { id: UniqueEntityID }>(...aggregateRoots: AggregateRoot<T>[]): Promise<void>;
}
