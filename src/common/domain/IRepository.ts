import { UniqueEntityID } from './UniqueEntityID';

export interface IRepository<T> {
  recordExistsForFilter(filter: unknown): Promise<boolean>;
  findById(id: UniqueEntityID | string): Promise<Result<T>>;
  findByIds(ids: UniqueEntityID[] | string[]): Promise<Result<T[]>>;
  save(dto: T): Promise<Result<void>>;
}
