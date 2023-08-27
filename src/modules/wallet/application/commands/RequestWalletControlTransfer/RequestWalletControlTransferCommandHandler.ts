import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { NewWalletAssetTransferDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletAssetTransferDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletAssetType } from 'src/modules/wallet/domain/wallet/WalletAssetType';
import { RequestWalletControlTransferCommand } from './RequestWalletControlTransferCommand';

@CommandHandler(RequestWalletControlTransferCommand)
export class RequestWalletControlTransferCommandHandler extends CommandHandlerBase<
  RequestWalletControlTransferCommand,
  UniqueEntityID
> {
  constructor(private walletsRepo: IWalletsRepository, private repoManager: IRepositoryManager) {
    super();
  }

  protected async executeImpl(
    command: RequestWalletControlTransferCommand,
  ): Promise<Result<UniqueEntityID>> {
    const request = plainToClass(NewWalletAssetTransferDTO, command);
    request.type = WalletAssetType.Control;
    request.destinationId = new UniqueEntityID(command.toHolderId);
    const wallet = await this.walletsRepo.findById(command.walletId);
    const transferId = await wallet.requestAssetTransfer(request);
    await this.repoManager.save(wallet);
    return Result.ok(transferId);
  }
}
