import { IPersistenceManager } from '../../../../common/infrastructure/IPersistenceManager';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { AggregateRoot } from '@Common/domain/AggregateRoot';
import RepositoryProvider from '@SharedKernel/infrastructure/persistence/RepositoryProvider';
import { Result } from '@Common/utils/Result';
import { EventBus } from '@nestjs/cqrs';
import { IDomainEvent } from '@Common/domain/event/IDomainEvent';
import { Inject } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '@SharedKernel/shared-kernel.module-definition';
import { SharedKernelModuleOptions } from '@SharedKernel/shared-kernel.module';
import { IRepository } from '@Common/domain/IRepository';

export default class PersistenceManager implements IPersistenceManager {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: SharedKernelModuleOptions,
    private repositoryProvider: RepositoryProvider,
    private eventBus: EventBus,
  ) {}

  getRepository<T extends { id: UniqueEntityID }>(
    aggregateRoot: typeof AggregateRoot<T>,
  ): IRepository<AggregateRoot<T>> {
    return this.repositoryProvider.get(aggregateRoot);
  }

  async flush<T extends { id: UniqueEntityID }>(
    ...aggregateRoots: AggregateRoot<T>[]
  ): Promise<Result<void, Error>> {
    const domainEvents: IDomainEvent[] = [];
    for (const aggregateRoot of aggregateRoots) {
      const repository = this.repositoryProvider.getByName(aggregateRoot.name);
      if (!repository) continue;
      await repository.sync(aggregateRoot);
      aggregateRoot.domainEvents.forEach((e) => domainEvents.push(e));
    }

    const result = await Result.resolve(this.options.entityManager.flush());
    if (result.IS_SUCCESS) this.eventBus.publishAll(domainEvents);
    return result;
  }
}
