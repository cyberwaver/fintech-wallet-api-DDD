import { ICommandHandler } from '@nestjs/cqrs';

export abstract class CommandHandlerBase<T, R, CR = Result<void | R>>
  implements ICommandHandler<T, CR>
{
  protected abstract executeImpl(command: T, initiator?: unknown): Promise<CR>;

  public async execute(command: T, initiator?: unknown): Promise<CR> {
    return await this.executeImpl(command, initiator);
  }
}
