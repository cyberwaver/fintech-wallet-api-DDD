import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { IAuthenticationsRepository } from 'src/modules/access/domain/authentication/IAuthenticationsRepository';
import { RequestPasswordResetCommand } from './RequestPasswordResetCommand';
import { Result } from '@Common/utils/Result';
import { Injectable } from '@nestjs/common';

@Injectable()
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetCommandHandler extends CommandHandlerBase<
  RequestPasswordResetCommand,
  UniqueEntityID
> {
  constructor(
    private authService: AuthenticationService,
    private authsRepo: IAuthenticationsRepository,
    private persistence: IPersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: RequestPasswordResetCommand): Promise<Result<null>> {
    const result = await this.authsRepo.findOneByEmailAndType(command.email, command.type);
    if (result.IS_FAILURE) return Result.fail(result.error);
    const authentication = result.value;
    await authentication.requestPasswordReset(this.authService);
    await this.persistence.flush(authentication);
    return Result.ok();
  }
}
