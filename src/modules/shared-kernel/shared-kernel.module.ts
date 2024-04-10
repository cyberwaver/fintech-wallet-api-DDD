import { Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import RepositoryProvider from './infrastructure/persistence/RepositoryProvider';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConfigurableModuleClass } from './shared-kernel.module-definition';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import PersistenceManager from './infrastructure/persistence/PersistenceManager';

export interface SharedKernelModuleOptions {
  discoveryService: DiscoveryService;
  entityManager: EntityManager;
}

@Module({
  imports: [DiscoveryModule],
  providers: [RepositoryProvider, { provide: IPersistenceManager, useClass: PersistenceManager }],
  exports: [RepositoryProvider, { provide: IPersistenceManager, useClass: PersistenceManager }],
})
export class SharedKernelModule extends ConfigurableModuleClass {}
