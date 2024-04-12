import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { SharedKernelModule } from '@SharedKernel/shared-kernel.module';
import { IAuthenticationsRepository } from './domain/authentication/IAuthenticationsRepository';
import AuthenticationsRepository from './infrastructure/persistence/mikro-orm/repositories/AuthenticationsRepository';
import { ConfigService } from '@nestjs/config';
import { AuthenticationController } from './interface/controllers/v1/AuthenticationController';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateAuthenticationCommandHandler } from './application/commands/CreateAuthentication/CreateAuthenticationCommandHandler';
import { AuthenticationService } from './domain/authentication/AuthenticationService';
import { GenerateAuthTokensCommandHandler } from './application/commands/GenerateAuthTokens/GenerateAuthTokensCommandHandler';
import { RequestPasswordResetCommandHandler } from './application/commands/RequestPasswordReset/RequestPasswordResetCommandHandler';
import { ResetPasswordCommandHandler } from './application/commands/ResetPassword/ResetPasswordCommandHandler';
console.log(process.env.MIKRO_ORM_ACCESS_DB);
@Module({
  imports: [
    DiscoveryModule,
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        dbName: configService.get<string>('mikro_orm.access.db'),
        user: configService.get<string>('mikro_orm.access.user'),
        password: configService.get<string>('mikro_orm.access.password'),
        entities: ['./dist/modules/access/infrastructure/persistence/mikro-orm/entities/*.js'],
        entitiesTs: ['./src/modules/access/infrastructure/persistence/mikro-orm/entities/*.ts'],
        metadataProvider: TsMorphMetadataProvider,
        debug: true,
      }),
      inject: [ConfigService],
    }),
    SharedKernelModule.registerAsync({
      useFactory: (discoveryService: DiscoveryService, em: EntityManager) => ({
        discoveryService,
        entityManager: em,
      }),
      inject: [DiscoveryService, EntityManager],
    }),
    CqrsModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    { provide: IAuthenticationsRepository, useClass: AuthenticationsRepository },
    CreateAuthenticationCommandHandler,
    GenerateAuthTokensCommandHandler,
    RequestPasswordResetCommandHandler,
    ResetPasswordCommandHandler,
    AuthenticationService,
  ],
})
export class AccessModule {}
