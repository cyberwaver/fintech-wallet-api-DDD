import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { NewWalletDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletDTO';
import { Wallet } from 'src/modules/wallet/domain/wallet/Wallet';
import { WalletService } from 'src/modules/wallet/domain/WalletService';
import { CreateWalletCommand } from './CreateWalletCommand';

@CommandHandler(CreateWalletCommand)
export class CreateWalletCommandHandler extends CommandHandlerBase<
  CreateWalletCommand,
  UniqueEntityID
> {
  constructor(private walletService: WalletService, private repoManager: IRepositoryManager) {
    super();
  }

  protected async executeImpl(command: CreateWalletCommand): Promise<Result<UniqueEntityID>> {
    const dto = plainToClass(NewWalletDTO, command);
    const wallet = await Wallet.create(dto, this.walletService);
    await this.repoManager.save(wallet);
    return Result.ok(wallet.ID);
  }
}
