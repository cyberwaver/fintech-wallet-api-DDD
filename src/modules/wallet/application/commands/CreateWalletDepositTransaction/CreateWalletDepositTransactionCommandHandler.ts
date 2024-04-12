import { CommandHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { CommandHandlerBase } from 'src/common/application/CommandHandlerBase';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IPersistenceManager } from '@Common/infrastructure/IPersistenceManager';
import { IWalletTemplatesRepository } from 'src/modules/wallet/domain/wallet-template/IWalletTemplatesRepository';
import { NewWalletTransactionDTO } from 'src/modules/wallet/domain/wallet/dto/NewWalletTransactionDTO';
import { IWalletsRepository } from 'src/modules/wallet/domain/wallet/IWalletsRepository';
import { WalletTransactionClass } from 'src/modules/wallet/domain/wallet/WalletTransactionClass';
import { WalletTransactionType } from 'src/modules/wallet/domain/wallet/WalletTransactionType';
import { WalletService } from 'src/modules/wallet/domain/WalletService';
import { CreateWalletDepositTransactionCommand } from './CreateWalletDepositTransactionCommand';
import { Result } from '@Common/utils/Result';

@CommandHandler(CreateWalletDepositTransactionCommand)
export class CreateWalletDepositTransactionCommandHandler extends CommandHandlerBase<
  CreateWalletDepositTransactionCommand,
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

  protected async executeImpl(
    command: CreateWalletDepositTransactionCommand,
  ): Promise<Result<UniqueEntityID>> {
    const dto = plainToClass(NewWalletTransactionDTO, command);
    dto.class = WalletTransactionClass.Financial;
    dto.type = WalletTransactionType.Deposit;

    const result = await this.walletsRepo.findById(dto.walletId);
    if (result.IS_FAILURE) return Result.fail(result.error);
    const wallet = result.value;

    const templateResult = await this.walletTemplatesRepo.findById(wallet.templateId);
    if (templateResult.IS_FAILURE) return Result.fail(templateResult.error);
    const template = templateResult.value;

    const txnId = await wallet.handleTransactionRequest(dto, template);
    await this.persistence.flush(wallet);
    return Result.ok(txnId);
  }
}
