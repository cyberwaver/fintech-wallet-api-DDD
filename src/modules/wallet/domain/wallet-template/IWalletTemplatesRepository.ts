import { IRepository } from 'src/common/domain/IRepository';
import { WalletTemplate } from './WalletTemplate';

export abstract class IWalletTemplatesRepository extends IRepository<WalletTemplate> {}
