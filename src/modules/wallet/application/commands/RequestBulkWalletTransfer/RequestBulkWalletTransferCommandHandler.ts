import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { Amount } from 'src/common/domain/Amount';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { IWalletTemplatesRepository } from 'src/modules/wallet/domain/wallet-template/IWalletTemplatesRepository';
import { NewWalletTransactionDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletTransactionDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletTransactionClass } from 'src/modules/wallet/domain/wallet/WalletTransactionClass';
import { WalletTransactionType } from 'src/modules/wallet/domain/wallet/WalletTransactionType';
import { WalletService } from 'src/modules/wallet/domain/WalletService';
import { RequestBulkWalletTransferCommand } from './RequestBulkWalletTransferCommand';

@CommandHandler(RequestBulkWalletTransferCommand)
export class RequestBulkWalletTransferCommandHandler extends CommandHandlerBase<
  RequestBulkWalletTransferCommand,
  UniqueEntityID
> {
  constructor(
    private walletService: WalletService,
    private walletsRepo: IWalletsRepository,
    private walletTemplatesRepo: IWalletTemplatesRepository,
    private persistence: IPersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: RequestBulkWalletTransferCommand): Promise<Result<void>> {
    const request = plainToClass(NewWalletTransactionDTO, command);
    request.class = WalletTransactionClass.Auth;
    request.type = WalletTransactionType.TransferFrom;
    request.amount = Amount.create(command.payees.reduce((sum, p) => sum + p.amount, 0));

    const walletResult = await this.walletsRepo.findByIdWithHolder(command.walletId, command.holderId);
    if (walletResult.IS_FAILURE) return Result.fail(walletResult.error);
    const wallet = walletResult.value;

    const templateResult = await this.walletTemplatesRepo.findById(wallet.templateId);
    if (templateResult.IS_FAILURE) return Result.fail(templateResult.error);
    const template = templateResult.value;

    const result = await Result.resolve(wallet.handleTransactionRequest(request, template));
    if (result.IS_FAILURE) return Result.fail(result.error);

    await this.persistence.flush(wallet);
    return Result.ok();
  }
}
