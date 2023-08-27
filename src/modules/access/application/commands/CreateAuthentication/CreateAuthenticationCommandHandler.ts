import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { Authentication } from 'src/modules/access/domain/authentication/Authentication';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { NewAuthenticationDTO } from 'src/modules/access/domain/authentication/dto/NewAuthenticationDTO';
import { CreateAuthenticationCommand } from './CreateAuthenticationCommand';

@CommandHandler(CreateAuthenticationCommand)
export class CreateAuthenticationCommandHandler extends CommandHandlerBase<
  CreateAuthenticationCommand,
  UniqueEntityID
> {
  constructor(private authService: AuthenticationService, private repoManager: IRepositoryManager) {
    super();
  }

  protected async executeImpl(
    command: CreateAuthenticationCommand,
  ): Promise<Result<UniqueEntityID>> {
    const dto = plainToClass(NewAuthenticationDTO, command);
    const authentication = await Authentication.create(dto, this.authService);
    await this.repoManager.save(authentication);
    return Result.ok(authentication.ID);
  }
}
