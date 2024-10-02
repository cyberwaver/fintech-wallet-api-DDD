import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Authentication } from 'src/modules/access/domain/authentication/Authentication';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { NewAuthenticationDTO } from '@Access/domain/authentication/dto/NewAuthenticationDTO';
import { CreateAuthenticationCommand } from './CreateAuthenticationCommand';
import { Result } from '@Common/utils/Result';
import { Injectable } from '@nestjs/common';
import { IPersistenceManager } from '@Common/infrastructure/persistence/IPersistenceManager';

@Injectable()
@CommandHandler(CreateAuthenticationCommand)
export class CreateAuthenticationCommandHandler extends CommandHandlerBase<
  CreateAuthenticationCommand,
  UniqueEntityID
> {
  constructor(
    private authService: AuthenticationService,
    private persistence: IPersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: CreateAuthenticationCommand): Promise<Result<UniqueEntityID>> {
    const dto = plainToClass(NewAuthenticationDTO, command);
    const result = await Result.resolve(Authentication.create(dto, this.authService));
    if (result.IS_FAILURE) return Result.fail(result.error);
    const authentication = result.value;

    await this.persistence.flush(authentication);
    return Result.ok(authentication.ID);
  }
}
