import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { InvalidCredentialException } from 'src/common/exceptions/exceptions.index';
import {
  AuthenticationService,
  AuthTokens,
} from 'src/modules/access/domain/authentication/AuthenticationService';
import { IAuthenticationsRepository } from 'src/modules/access/domain/authentication/IAuthenticationsRepository';
import { GenerateAuthTokensCommand } from './GenerateAuthTokensCommand';
import { Result } from '@Common/utils/Result';
import { Injectable } from '@nestjs/common';

@Injectable()
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
    const authenticationResult = await this.authsRepo.findOneByEmailAndType(command.email, command.type);
    if (authenticationResult.IS_FAILURE) return Result.fail(authenticationResult.error);
    const authentication = authenticationResult.value;

    const passwordMatches = await this.authService.comparePassword(command.password, authentication.password);
    if (!passwordMatches) return Result.fail(new InvalidCredentialException('Invalid username or password'));
    const result = await this.authService.generateAuthTokens(
      {
        authId: authentication.ID,
        type: authentication.type,
        firstName: authentication.firstName,
        lastName: authentication.lastName,
        email: authentication.email,
      },
      authentication.type,
    );
    if (result.IS_FAILURE) return Result.fail(result.error);
    return Result.ok(result.value);
  }
}
