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
    const wallet = await this.walletsRepo.findById(dto.walletId);
    const template = await this.walletTemplatesRepo.findById(wallet.templateId);
    const txnId = await wallet.handleTransactionRequest(dto, template, this.walletService);
    await this.persistence.flush(wallet);
    return Result.ok(txnId);
  }
}
