import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { InvalidCredentialException } from 'src/common/exceptions/InvalidCredentialException';
import { AuthenticationService } from 'src/modules/access/domain/authentication/AuthenticationService';
import { PasswordResetDTO } from 'src/modules/access/domain/authentication/dto/PasswordResetDTO';
import { IAuthenticationsRepository } from 'src/modules/access/domain/authentication/IAuthenticationsRepository';
import { ResetPasswordCommand } from './ResetPasswordCommand';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler extends CommandHandlerBase<
  ResetPasswordCommand,
  UniqueEntityID
> {
  constructor(
    private authService: AuthenticationService,
    private authsRepo: IAuthenticationsRepository,
  ) {
    super();
  }

  protected async executeImpl(command: ResetPasswordCommand): Promise<Result<null>> {
    const verifyResult = await this.authService.verifyPasswordResetToken(
      command.token,
      command.type,
    );

    if (!verifyResult.isSuccess) {
      return Result.fail(new InvalidCredentialException('Invalid token.'));
    }

    const authentication = await this.authsRepo.findOneByEmailAndType(
      verifyResult.value.email,
      command.type,
    );

    await authentication.resetPassword(plainToClass(PasswordResetDTO, command), this.authService);
    return Result.ok();
  }
}
