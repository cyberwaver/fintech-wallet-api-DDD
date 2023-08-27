import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { IAuthenticationsRepository } from 'src/modules/access/domain/authentication/IAuthenticationsRepository';
import { RequestPasswordResetCommand } from './RequestPasswordResetCommand';

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetCommandHandler extends CommandHandlerBase<
  RequestPasswordResetCommand,
  UniqueEntityID
> {
  constructor(
    private authService: AuthenticationService,
    private authsRepo: IAuthenticationsRepository,
    private repoManager: IRepositoryManager,
  ) {
    super();
  }

  protected async executeImpl(command: RequestPasswordResetCommand): Promise<Result<null>> {
    const authentication = await this.authsRepo.findOneByEmailAndType(command.email, command.type);
    await authentication.requestPasswordReset(this.authService);
    await this.repoManager.save(authentication);
    return Result.ok();
  }
}
