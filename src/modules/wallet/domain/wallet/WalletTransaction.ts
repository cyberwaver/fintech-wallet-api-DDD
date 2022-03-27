import { Entity } from "src/shared/domain/Entity";
import { NewWalletTransactionDTO, WalletTransactionDTO } from "./DTOs/index.dtos";

export class WalletTransaction extends Entity<WalletTransactionDTO> {
  walletId: string;
  accountId: string;
  status: string;
  createdAt: string;

  constructor(props: WalletTransactionDTO) {
    super(props.id, WalletTransactionDTO);
  }

  async Create(data: NewWalletTransactionDTO) {}
}
