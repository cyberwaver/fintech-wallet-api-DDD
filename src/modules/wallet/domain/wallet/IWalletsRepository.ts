import { IRepository } from 'src/common/domain/IRepository';
import { WalletDTO } from './DTOs/WalletDTO';

export interface IWalletsRepository extends IRepository<WalletDTO> {}
