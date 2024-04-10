import { Result } from '@Common/utils/Result';
import { IRepository } from 'src/common/domain/IRepository';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Wallet } from './Wallet';
import { WalletId } from './WalletId';

export interface IWalletsRepository extends IRepository<Wallet> {
  findByIdWithHolder(walletId: WalletId | string, holderId: UniqueEntityID | string): Promise<Result<Wallet>>;
  findByIdWithHolderAndTransfer(
    walletId: WalletId | string,
    holderId: UniqueEntityID | string,
    transferId: UniqueEntityID | string,
  ): Promise<Result<Wallet>>;
}
