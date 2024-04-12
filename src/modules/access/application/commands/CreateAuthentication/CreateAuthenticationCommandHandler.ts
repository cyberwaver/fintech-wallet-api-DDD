import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Authentication } from 'src/modules/access/domain/authentication/Authentication';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { NewAuthenticationDTO } from 'src/modules/access/domain/authentication/dto/NewAuthenticationDTO';
import { CreateAuthenticationCommand } from './CreateAuthenticationCommand';
import { Result } from '@Common/utils/Result';
import { Injectable } from '@nestjs/common';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { InvalidCredentialException } from 'src/common/exceptions/InvalidCredentialException';

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
    const a = Result;
    const result = await Result.resolve(Authentication.create(dto, this.authService));
    if (result.IS_FAILURE) return Result.fail(result.error);
    const authentication = result.value;

    await this.persistence.flush(authentication);
    return Result.ok(authentication.ID);
  }
}
