import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IRepository } from '@Common/domain/IRepository';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { AggregateRoot } from '@Common/domain/AggregateRoot';
import ARepository from '@Common/infrastructure/ARepository';
import { SharedKernelModuleOptions } from '@SharedKernel/shared-kernel.module';
import { MODULE_OPTIONS_TOKEN } from '@SharedKernel/shared-kernel.module-definition';

@Injectable()
export default class RepositoryProvider implements OnModuleInit {
  private repositories: Map<string, IRepository<AggregateRoot<any>>> = new Map();
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: SharedKernelModuleOptions) {}

  public get<T extends { id: UniqueEntityID }>(
    clazz: typeof AggregateRoot<T>,
  ): IRepository<AggregateRoot<T>> {
    return this.repositories.get(clazz.name);
  }

  public getByName<T extends AggregateRoot<{ id: UniqueEntityID }>>(aggregateName: string): IRepository<T> {
    return this.repositories.get(aggregateName) as IRepository<T>;
  }

  public async onModuleInit() {
    const providers =
      await this.options.discoveryService.providersWithMetaAtKey<
        typeof AggregateRoot<{ id: UniqueEntityID }>
      >('aggregate');

    providers.forEach((provider) => {
      if (!(provider.discoveredClass.instance instanceof ARepository)) return;
      this.repositories.set(provider.meta.name, provider.discoveredClass.instance);
    });
  }
}
