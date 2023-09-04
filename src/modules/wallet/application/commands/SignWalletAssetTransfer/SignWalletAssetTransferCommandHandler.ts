import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { SignWalletAssetTransferCommand } from './SignWalletAssetTransferCommand';

@CommandHandler(SignWalletAssetTransferCommand)
export class SignWalletAssetTransferCommandHandler extends CommandHandlerBase<
  SignWalletAssetTransferCommand,
  UniqueEntityID
> {
  constructor(private walletsRepo: IWalletsRepository, private repoManager: IRepositoryManager) {
    super();
  }

  protected async executeImpl(command: SignWalletAssetTransferCommand): Promise<Result<void>> {
    const walletResult = await this.walletsRepo.findByIdWithHolderAndTransfer(
      command.walletId,
      command.initiatorId,
      command.transferId,
    );
    if (walletResult.IS_FAILURE) return Result.fail(walletResult.error);
    const wallet = walletResult.value;

    const result = await Result.resolve(
      wallet.signAssetTransfer(
        new UniqueEntityID(command.transferId),
        new UniqueEntityID(command.initiatorId),
      ),
    );
    if (result.IS_FAILURE) return Result.fail(result.error);

    await this.repoManager.save(wallet);
    return Result.ok();
  }
}
