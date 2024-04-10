import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Authentication } from 'src/modules/access/domain/authentication/Authentication';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { NewAuthenticationDTO } from 'src/modules/access/domain/authentication/dto/NewAuthenticationDTO';
import { CreateAuthenticationCommand } from './CreateAuthenticationCommand';
import { Result } from '@Common/utils/Result';
import PersistenceManager from '@SharedKernel/infrastructure/persistence/PersistenceManager';

@CommandHandler(CreateAuthenticationCommand)
export class CreateAuthenticationCommandHandler extends CommandHandlerBase<
  CreateAuthenticationCommand,
  UniqueEntityID
> {
  constructor(
    private authService: AuthenticationService,
    private persistence: PersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: CreateAuthenticationCommand): Promise<Result<UniqueEntityID>> {
    const dto = plainToClass(NewAuthenticationDTO, command);
    const authentication = await Authentication.create(dto, this.authService);
    await this.persistence.flush(authentication);
    return Result.ok(authentication.ID);
  }
}
