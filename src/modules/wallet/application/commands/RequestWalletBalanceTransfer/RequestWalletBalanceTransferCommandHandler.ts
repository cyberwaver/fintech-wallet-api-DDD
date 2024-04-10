import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { NewWalletAssetTransferDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletAssetTransferDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletAssetType } from 'src/modules/wallet/domain/wallet/WalletAssetType';
import { RequestWalletBalanceTransferCommand } from './RequestWalletBalanceTransferCommand';

@CommandHandler(RequestWalletBalanceTransferCommand)
export class RequestWalletBalanceTransferCommandHandler extends CommandHandlerBase<
  RequestWalletBalanceTransferCommand,
  UniqueEntityID
> {
  constructor(private walletsRepo: IWalletsRepository, private persistence: IPersistenceManager) {
    super();
  }

  protected async executeImpl(command: RequestWalletBalanceTransferCommand): Promise<Result<UniqueEntityID>> {
    const request = plainToClass(NewWalletAssetTransferDTO, command);
    request.type = WalletAssetType.Balance;
    const wallet = await this.walletsRepo.findById(command.walletId);
    const transferId = await wallet.requestAssetTransfer(request);
    await this.persistence.flush(wallet);
    return Result.ok(transferId);
  }
}
