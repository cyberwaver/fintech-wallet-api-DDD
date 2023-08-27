import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { Amount } from 'src/common/domain/Amount';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { IWalletTemplatesRepository } from 'src/modules/wallet/domain/wallet-template/IWalletTemplatesRepository';
import { NewWalletTransactionDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletTransactionDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletTransactionClass } from 'src/modules/wallet/domain/wallet/WalletTransactionClass';
import { WalletTransactionType } from 'src/modules/wallet/domain/wallet/WalletTransactionType';
import { WalletService } from 'src/modules/wallet/domain/WalletService';
import { ProcessBulkWalletTransferCommand } from './ProcessBulkWalletTransferCommand';

@CommandHandler(ProcessBulkWalletTransferCommand)
export class ProcessBulkWalletTransferCommandHandler extends CommandHandlerBase<
  ProcessBulkWalletTransferCommand,
  UniqueEntityID
> {
  constructor(
    private walletService: WalletService,
    private walletsRepo: IWalletsRepository,
    private walletTemplatesRepo: IWalletTemplatesRepository,
    private repoManager: IRepositoryManager,
  ) {
    super();
  }

  protected async executeImpl(command: ProcessBulkWalletTransferCommand): Promise<Result<void>> {
    const request = plainToClass(NewWalletTransactionDTO, command);
    request.class = WalletTransactionClass.Auth;
    request.type = WalletTransactionType.TransferFrom;
    request.amount = Amount.create(command.payees.reduce((sum, p) => sum + p.amount, 0));
    const wallet = await this.walletsRepo.findByIdWithHolder(command.walletId, command.holderId);
    const template = await this.walletTemplatesRepo.findById(wallet.templateId);
    await wallet.handleTransactionRequest(request, template);

    await this.repoManager.save(wallet);
    return Result.ok();
  }
}
