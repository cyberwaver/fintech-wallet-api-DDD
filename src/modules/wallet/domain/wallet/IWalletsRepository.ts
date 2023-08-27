import { IRepository } from 'src/common/domain/IRepository';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Wallet } from './Wallet';
import { WalletId } from './WalletId';

export interface IWalletsRepository extends IRepository<Wallet> {
  // findPayeesWallet(payees: WalletTransactionPayee[]): Promise<Wallet[]>;
  findByIdWithHolder(
    walletId: WalletId | string,
    holderId: UniqueEntityID | string,
  ): Promise<Result<Wallet>>;
}
