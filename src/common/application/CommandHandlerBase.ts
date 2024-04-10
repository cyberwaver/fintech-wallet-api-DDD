import { Result } from '@Common/utils/Result';
import { ICommandHandler } from '@nestjs/cqrs';

export abstract class CommandHandlerBase<T, R, CR extends Result<R, Error> = Result<R, Error>>
  implements ICommandHandler<T, CR>
{
  protected abstract executeImpl(command: T, initiator?: unknown): Promise<CR>;

  public async execute(command: T, initiator?: unknown): Promise<CR> {
    const result = await this.executeImpl(command, initiator);
    return result;
  }
}
