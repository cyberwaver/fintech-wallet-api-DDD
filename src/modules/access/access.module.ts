import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { SharedKernelModule } from '@SharedKernel/shared-kernel.module';
import { IAuthenticationsRepository } from './domain/authentication/IAuthenticationsRepository';
import AuthenticationsRepository from './infrastructure/persistence/mikro-orm/repositories/AuthenticationsRepository';

@Module({
  imports: [
    DiscoveryModule,
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      dbName: process.env.MIKRO_ORM_ACCESS_DB,
      user: process.env.MIKRO_ORM_ACCESS_DB_USER,
      password: process.env.MIKRO_ORM_ACCESS_DB_PASSWORD,
      entities: ['./dist/modules/access/infrastructure/persistence/mikro-orm/entities/*.js'],
      entitiesTs: ['./src/modules/access/infrastructure/persistence/mikro-orm/entities/*.ts'],
      metadataProvider: TsMorphMetadataProvider,
      debug: true,
    }),
    SharedKernelModule.registerAsync({
      useFactory: (discoveryService: DiscoveryService, em: EntityManager) => ({
        discoveryService,
        entityManager: em,
      }),
      inject: [DiscoveryService, EntityManager],
    }),
  ],
  providers: [{ provide: IAuthenticationsRepository, useClass: AuthenticationsRepository }],
})
export class AccessModule {}
