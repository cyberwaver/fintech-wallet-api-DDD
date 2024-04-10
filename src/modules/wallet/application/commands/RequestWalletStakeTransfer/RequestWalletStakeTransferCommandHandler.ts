import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { NewWalletAssetTransferDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletAssetTransferDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletAssetType } from 'src/modules/wallet/domain/wallet/WalletAssetType';
import { RequestWalletStakeTransferCommand } from './RequestWalletStakeTransferCommand';

@CommandHandler(RequestWalletStakeTransferCommand)
export class RequestWalletStakeTransferCommandHandler extends CommandHandlerBase<
  RequestWalletStakeTransferCommand,
  UniqueEntityID
> {
  constructor(private walletsRepo: IWalletsRepository, private persistence: IPersistenceManager) {
    super();
  }

  protected async executeImpl(command: RequestWalletStakeTransferCommand): Promise<Result<UniqueEntityID>> {
    const request = plainToClass(NewWalletAssetTransferDTO, command);
    request.type = WalletAssetType.Stake;
    request.sourceId = new UniqueEntityID(command.fromHolderId);
    request.destinationId = new UniqueEntityID(command.toHolderId);
    const wallet = await this.walletsRepo.findById(command.walletId);
    const transferId = await wallet.requestAssetTransfer(request);
    await this.persistence.flush(wallet);
    return Result.ok(transferId);
  }
}
