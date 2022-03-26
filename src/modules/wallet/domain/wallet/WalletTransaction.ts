import { Entity } from "src/shared/domain/Entity";
import { NewWalletTransactionDTO, WalletTransactionDTO } from "./DTOs/index.dtos";


export class WalletHolder extends Entity<WalletTransactionDTO> {
    walletId: string;
    accountId: string;
    status: string;
    createdAt: string;

    async Create(data: NewWalletTransactionDTO) {

    }
}