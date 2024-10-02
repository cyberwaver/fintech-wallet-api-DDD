import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/persistence/IPersistenceManager';
import { UpdateWalletTemplateCommand } from './UpdateWalletTemplateCommand';
import { Result } from '@Common/utils/Result';
import { NewWalletTemplateDTO } from '@Wallet/domain/wallet-template/DTOs/NewWalletTemplateDTO';
import { WalletTemplate } from '@Wallet/domain/wallet-template/WalletTemplate';

@CommandHandler(UpdateWalletTemplateCommand)
export class UpdateWalletTemplateCommandHandler extends CommandHandlerBase<
  UpdateWalletTemplateCommand,
  UniqueEntityID
> {
  constructor(private persistence: IPersistenceManager) {
    super();
  }

  protected async executeImpl(command: UpdateWalletTemplateCommand): Promise<Result<UniqueEntityID>> {
    const dto = plainToClass(NewWalletTemplateDTO, command);
    const template = await WalletTemplate.create(dto);
    await this.persistence.flush(template);
    return Result.ok(template.ID);
  }
}
