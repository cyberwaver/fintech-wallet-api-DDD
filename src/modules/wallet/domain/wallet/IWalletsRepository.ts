import { IRepository } from "src/shared/domain/IRepository";
import { WalletDTO } from "./DTOs/WalletDTO";

export interface IWalletsRepository extends IRepository<WalletDTO> {}
