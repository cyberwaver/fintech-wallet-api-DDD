import { plainToInstance } from "class-transformer";
import { Entity } from "src/shared/domain/Entity";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { NewWalletHolderDTO, WalletHolderDTO } from "./DTOs/dtos.index";
import { WalletHolderStatus } from "./WalletHolderStatus";

class WalletHolderProps {
  id: UniqueEntityID;
  walletId: string;
  accountId: string;
  status: WalletHolderStatus;
  isCreator: boolean;
  createdAt: string;
}

export class WalletHolder extends Entity<WalletHolderProps> {
  constructor(dto: WalletHolderDTO) {
    super(dto, WalletHolderProps);
  }

  Create(data: NewWalletHolderDTO): WalletHolder {
    return plainToInstance(WalletHolder, data);
  }
}
