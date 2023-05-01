import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { CreateWalletCommand } from './CreateWalletCommand';

@CommandHandler(CreateWalletCommand)
export class CreateWalletCommandHandler extends CommandHandlerBase<
  CreateWalletCommand,
  UniqueEntityID
> {
  constructor() {
    super();
  }

  protected async executeImpl(command: CreateWalletCommand): Promise<Result<UniqueEntityID>> {
    return Result.ok(new UniqueEntityID('ID'));
  }
}
