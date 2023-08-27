import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IRepositoryManager } from 'src/common/infrastructure/IRepositoryManager';
import { IWalletTemplatesRepository } from 'src/modules/wallet/domain/wallet-template/IWalletTemplatesRepository';
import { NewWalletTransactionDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletTransactionDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletTransactionClass } from 'src/modules/wallet/domain/wallet/WalletTransactionClass';
import { WalletTransactionType } from 'src/modules/wallet/domain/wallet/WalletTransactionType';
import { CreateWalletTransferTransactionCommand } from './CreateWalletTransferTransactionCommand';

@CommandHandler(CreateWalletTransferTransactionCommand)
export class CreateWalletTransferTransactionCommandHandler extends CommandHandlerBase<
  CreateWalletTransferTransactionCommand,
  UniqueEntityID
> {
  constructor(
    private walletsRepo: IWalletsRepository,
    private walletTemplatesRepo: IWalletTemplatesRepository,
    private repoManager: IRepositoryManager,
  ) {
    super();
  }

  protected async executeImpl(
    command: CreateWalletTransferTransactionCommand,
  ): Promise<Result<UniqueEntityID>> {
    //DEBIT LEG
    const debitRequest = plainToClass(NewWalletTransactionDTO, command);
    debitRequest.class = WalletTransactionClass.Financial;
    debitRequest.type = WalletTransactionType.TransferFrom;
    debitRequest.holderId = new UniqueEntityID(command.initiatorId);

    const walletResult = await this.walletsRepo.findByIdWithHolder(command.fromWalletId, command.initiatorId);
    if (walletResult.IS_FAILURE) return Result.fail(walletResult.error);
    const wallet = walletResult.value;

    const walletTemplateResult = await this.walletTemplatesRepo.findById(wallet.templateId);
    if (walletTemplateResult.IS_FAILURE) return Result.fail(walletTemplateResult.error);
    const walletTemplate = walletTemplateResult.value;

    const debitResult = await Result.resolve(wallet.handleTransactionRequest(debitRequest, walletTemplate));
    if (debitResult.IS_FAILURE) return Result.fail(debitResult.error);

    //CREDIT LEG
    const creditRequest = plainToClass(NewWalletTransactionDTO, command);
    creditRequest.class = WalletTransactionClass.Financial;
    creditRequest.type = WalletTransactionType.TransferTo;

    const creditWalletResult = await this.walletsRepo.findById(command.toWalletId);
    if (creditWalletResult.IS_FAILURE) return Result.fail(creditWalletResult.error);
    const creditWallet = creditWalletResult.value;

    const creditWalletTemplateResult = await this.walletTemplatesRepo.findById(creditWallet.templateId);
    if (creditWalletTemplateResult.IS_FAILURE) return Result.fail(creditWalletTemplateResult.error);
    const creditWalletTemplate = creditWalletTemplateResult.value;

    const creditResult = await Result.resolve(
      creditWallet.handleTransactionRequest(creditRequest, creditWalletTemplate),
    );
    if (creditResult.IS_FAILURE) return Result.fail(creditResult.error);

    await this.repoManager.save(wallet, creditWallet);
    return Result.ok(creditResult.value);
  }
}
