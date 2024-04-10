import { AggregateRoot } from '@Common/domain/AggregateRoot';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { Result } from '@Common/utils/Result';
import { FilterQuery } from '@mikro-orm/core';

export default abstract class ARepository<T extends AggregateRoot<{ id: UniqueEntityID }>> {
  async recordExistsForFilter(filter: Record<string, unknown>): Promise<Result<boolean>> {
    const result = await this.count(filter);
    if (result.IS_FAILURE) return Result.fail(result.error);
    return Result.ok(result.value > 0);
  }

  abstract sync(aggregate: T): Promise<Result<void, Error>>;

  abstract findByIds(ids: string[] | UniqueEntityID[]): Promise<Result<T[], Error>>;

  async findById(id: UniqueEntityID): Promise<Result<T>> {
    return this.findOne({ id: id.toString() });
  }

  abstract findOne(where: FilterQuery<unknown>): Promise<Result<T>>;

  abstract count(where: FilterQuery<unknown>): Promise<Result<number>>;
}
