import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { NewWalletAssetTransferDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletAssetTransferDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletAssetType } from 'src/modules/wallet/domain/wallet/WalletAssetType';
import { RequestWalletBalanceTransferCommand } from './RequestWalletBalanceTransferCommand';
import { Result } from '@Common/utils/Result';

@CommandHandler(RequestWalletBalanceTransferCommand)
export class RequestWalletBalanceTransferCommandHandler extends CommandHandlerBase<
  RequestWalletBalanceTransferCommand,
  UniqueEntityID
> {
  constructor(
    private walletsRepo: IWalletsRepository,
    private persistence: IPersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: RequestWalletBalanceTransferCommand): Promise<Result<UniqueEntityID>> {
    const request = plainToClass(NewWalletAssetTransferDTO, command);
    request.type = WalletAssetType.Balance;

    const walletResult = await this.walletsRepo.findById(command.walletId);
    if (walletResult.IS_FAILURE) return Result.fail(walletResult.error);
    const wallet = walletResult.value;

    const transferId = await wallet.requestAssetTransfer(request);
    await this.persistence.flush(wallet);
    return Result.ok(transferId);
  }
}
