import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import RepositoryProvider from './infrastructure/persistence/RepositoryProvider';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConfigurableModuleClass } from './shared-kernel.module-definition';
import { IPersistenceManager } from '@Common/infrastructure/persistence/IPersistenceManager';
import PersistenceManager from './infrastructure/persistence/PersistenceManager';
import { IHashingService } from '@Common/infrastructure/crypto/IHashingService';
import HashingService from './infrastructure/HashingService';
import JWTService from './infrastructure/persistence/JWTService';
import { IJWTService } from '@Common/infrastructure/crypto/IJWTService';

export interface SharedKernelModuleOptions {
  discoveryService: DiscoveryService;
  entityManager: EntityManager;
}

const persistence = { provide: IPersistenceManager, useClass: PersistenceManager };
const hashing = { provide: IHashingService, useClass: HashingService };
const jwt = { provide: IJWTService, useClass: JWTService };

@Module({
  imports: [DiscoveryModule, CqrsModule],
  providers: [RepositoryProvider, persistence, hashing, jwt],
  exports: [RepositoryProvider, persistence, hashing, jwt],
})
export class SharedKernelModule extends ConfigurableModuleClass {}
