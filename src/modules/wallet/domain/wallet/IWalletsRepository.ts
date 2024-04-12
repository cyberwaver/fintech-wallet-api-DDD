import { Result } from '@Common/utils/Result';
import { IRepository } from 'src/common/domain/IRepository';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { Wallet } from './Wallet';
import { WalletId } from './WalletId';

export abstract class IWalletsRepository extends IRepository<Wallet> {
  abstract findById(id: WalletId | string): Promise<Result<Wallet>>;
  abstract findByIdWithHolder(
    walletId: WalletId | string,
    holderId: UniqueEntityID | string,
  ): Promise<Result<Wallet>>;
  abstract findByIdWithHolderAndTransfer(
    walletId: WalletId | string,
    holderId: UniqueEntityID | string,
    transferId: UniqueEntityID | string,
  ): Promise<Result<Wallet>>;
}
