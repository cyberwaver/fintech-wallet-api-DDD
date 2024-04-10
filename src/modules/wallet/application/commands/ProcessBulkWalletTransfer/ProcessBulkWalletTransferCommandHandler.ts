import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { Amount } from 'src/common/domain/Amount';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { IWalletTemplatesRepository } from 'src/modules/wallet/domain/wallet-template/IWalletTemplatesRepository';
import { NewWalletTransactionDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletTransactionDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletTransactionClass } from 'src/modules/wallet/domain/wallet/WalletTransactionClass';
import { WalletTransactionType } from 'src/modules/wallet/domain/wallet/WalletTransactionType';
import { ProcessBulkWalletTransferCommand } from './ProcessBulkWalletTransferCommand';

@CommandHandler(ProcessBulkWalletTransferCommand)
export class ProcessBulkWalletTransferCommandHandler extends CommandHandlerBase<
  ProcessBulkWalletTransferCommand,
  UniqueEntityID
> {
  constructor(
    private walletsRepo: IWalletsRepository,
    private walletTemplatesRepo: IWalletTemplatesRepository,
    private persistence: IPersistenceManager,
  ) {
    super();
  }

  protected async executeImpl(command: ProcessBulkWalletTransferCommand): Promise<Result<void, Error>> {
    const debitRequest = new NewWalletTransactionDTO();
    debitRequest.class = WalletTransactionClass.AuthFinancial;
    debitRequest.type = WalletTransactionType.TransferFrom;

    const creditRequest = new NewWalletTransactionDTO();
    creditRequest.class = WalletTransactionClass.Financial;
    creditRequest.type = WalletTransactionType.TransferTo;

    const payerWalletResult = await this.walletsRepo.findById(command.walletId);
    if (payerWalletResult.IS_FAILURE) return Result.fail(payerWalletResult.error);
    const payerWallet = payerWalletResult.value;

    const payerWalletTemplateResult = await this.walletTemplatesRepo.findById(payerWallet.templateId);
    if (payerWalletTemplateResult.IS_FAILURE) return Result.fail(payerWalletTemplateResult.error);
    const payerWalletTemplate = payerWalletTemplateResult.value;

    const walletsResult = await this.walletsRepo.findByIds(command.payees.map((p) => p.walletId));
    if (walletsResult.IS_FAILURE) return Result.fail(walletsResult.error);
    const wallets = walletsResult.value;

    const templatesResult = await this.walletTemplatesRepo.findByIds(wallets.map((w) => w.templateId));
    if (templatesResult.IS_FAILURE) return Result.fail(templatesResult.error);
    const templates = templatesResult.value;

    for (const wallet of wallets) {
      const payee = command.payees.find((payee) => wallet.ID.equals(payee.walletId));
      if (!payee) continue;
      const template = templates.find((template) => template.ID.equals(wallet.templateId));
      const amountResult = Result.handleSync(() => Amount.create(payee.amount));
      if (amountResult.IS_FAILURE) return Result.fail(amountResult.error);
      creditRequest.amount = amountResult.value;
      const result = await Result.resolve(wallet.handleTransactionRequest(creditRequest, template));

      if (result.IS_SUCCESS) {
        debitRequest.amount = creditRequest.amount;
        const debitResult = await Result.resolve(
          wallet.handleTransactionRequest(debitRequest, payerWalletTemplate),
        );
        if (debitResult.IS_FAILURE) return Result.fail(debitResult.error);
      }
    }

    const completionRequest = new NewWalletTransactionDTO();
    completionRequest.class = WalletTransactionClass.Completion;
    completionRequest.type = WalletTransactionType.TransferFrom;
    completionRequest.amount = Amount.Zero;

    const completionResult = await Result.resolve(
      payerWallet.handleTransactionRequest(completionRequest, payerWalletTemplate),
    );
    if (completionResult.IS_FAILURE) return Result.fail(completionResult.error);

    await this.persistence.flush(payerWallet, ...wallets);
    return Result.ok();
  }
}
