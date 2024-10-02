import { AggregateRoot } from '@Common/domain/AggregateRoot';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { Result } from '@Common/utils/Result';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { WalletTemplate } from '@Wallet/infrastructure/persistence/mikro-orm/entities/WalletTemplate';
import { DaoEntity } from './DaoEntity';
import { EntityRepository } from '@mikro-orm/core';

export default abstract class ARepository<
  E extends DaoEntity,
  A extends AggregateRoot<{ id: UniqueEntityID }>,
> {
  protected dao: EntityRepository<E>;
  constructor(
    protected name: string,
    protected em: EntityManager,
    protected EntityClass: { new (...args: any[]): E },
  ) {
    this.dao = em.getRepository(EntityClass);
  }

  async recordExistsForFilter(filter: Record<string, unknown>): Promise<Result<boolean>> {
    const result = await this.count(filter);
    if (result.IS_FAILURE) return Result.fail(result.error);
    return Result.ok(result.value > 0);
  }

  async sync(walletTemplate: AggregateRoot<{ id: UniqueEntityID }>): Promise<Result<void, Error>> {
    let entity: DaoEntity;
    if (walletTemplate.ID.isNew) entity = new this.EntityClass();
    else {
      entity = await this.dao.findOne({ id: walletTemplate.ID.toString() } as FilterQuery<E>);
      if (!entity) return Result.fail(new NotFoundException(this.name + ' not found'));
    }

    entity.assign(walletTemplate.toObject());
    this.em.persist(entity);

    return Result.ok();
  }

  abstract findByIds(ids: string[] | UniqueEntityID[]): Promise<Result<A[], Error>>;

  async findById(id: UniqueEntityID): Promise<Result<A>> {
    return this.findOne({ id: id.toString() });
  }

  abstract findOne(where: FilterQuery<unknown>): Promise<Result<A>>;

  abstract count(where: FilterQuery<unknown>): Promise<Result<number>>;
}
