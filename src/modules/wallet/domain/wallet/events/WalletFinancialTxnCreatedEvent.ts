import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewWalletTransactionDTO } from '../dto/dtos.index';
import { WalletId } from '../WalletId';

export class WalletFinancialTxnCreatedEvent extends DomainEvent {
  public payload: NewWalletTransactionDTO & { transactionId: UniqueEntityID; walletId: WalletId };
  constructor(data: NewWalletTransactionDTO, transactionId: UniqueEntityID, walletId: WalletId) {
    super(walletId);
    this.payload = { ...data, walletId, transactionId };
  }
}
