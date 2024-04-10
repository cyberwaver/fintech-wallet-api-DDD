import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { InvalidCredentialException } from 'src/common/exceptions/InvalidCredentialException';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { PasswordResetDTO } from 'src/modules/access/domain/authentication/dto/PasswordResetDTO';
import { IAuthenticationsRepository } from 'src/modules/access/domain/authentication/IAuthenticationsRepository';
import { ResetPasswordCommand } from './ResetPasswordCommand';
import { Result } from '@Common/utils/Result';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler extends CommandHandlerBase<ResetPasswordCommand, UniqueEntityID> {
  constructor(
    private authService: AuthenticationService,
    private authsRepo: IAuthenticationsRepository,
    private persistence: IPersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: ResetPasswordCommand): Promise<Result<null>> {
    const verifyResult = await this.authService.verifyPasswordResetToken(command.token, command.type);

    if (!verifyResult.IS_SUCCESS) {
      return Result.fail(new InvalidCredentialException('Invalid password reset token.'));
    }

    const result = await this.authsRepo.findOneByEmailAndType(verifyResult.value.email, command.type);
    if (result.IS_FAILURE) return Result.fail(result.error);
    const authentication = result.value;
    await authentication.resetPassword(plainToClass(PasswordResetDTO, command), this.authService);
    await this.persistence.flush(authentication);
    return Result.ok();
  }
}
