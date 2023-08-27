import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { InvalidCredentialException } from 'src/common/exceptions/exceptions.index';
import {
  AuthenticationService,
  AuthTokens,
} from 'src/modules/access/domain/authentication/AuthenticationService';
import { IAuthenticationsRepository } from 'src/modules/access/domain/authentication/IAuthenticationsRepository';
import { GenerateAuthTokensCommand } from './GenerateAuthTokensCommand';

@CommandHandler(GenerateAuthTokensCommand)
export class GenerateAuthTokensCommandHandler extends CommandHandlerBase<
  GenerateAuthTokensCommand,
  AuthTokens
> {
  constructor(
    private authService: AuthenticationService,
    private authsRepo: IAuthenticationsRepository,
  ) {
    super();
  }

  protected async executeImpl(command: GenerateAuthTokensCommand): Promise<Result<AuthTokens>> {
    const authentication = await this.authsRepo.findOneByEmailAndType(command.email, command.type);
    const passwordMatches = await authentication.matchPassword(command.password, this.authService);
    if (!passwordMatches) return Result.fail(new InvalidCredentialException('Password incorrect.'));
    const tokens = await authentication.generateTokens(this.authService);
    return Result.ok(tokens);
  }
}
