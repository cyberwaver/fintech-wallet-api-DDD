import { plainToInstance } from "class-transformer";
import { Entity } from "src/shared/domain/Entity";
import { NewWalletHolderDTO, WalletHolderDTO } from "./DTOs/index.dtos";
import { WalletHolderStatus } from "./WalletHolderStatus";


export class WalletHolder extends Entity<WalletHolderDTO> {
    walletId: string;
    accountId: string;
    status: WalletHolderStatus;
    isCreator: boolean;
    createdAt: string;

    constructor(props: WalletHolderDTO) {
        super(props.id, WalletHolderDTO);
        this.walletId = props.walletId;
        this.status = new WalletHolderStatus(props.status);
        this.createdAt = props.createdAt;
    }

     Create(data: NewWalletHolderDTO): WalletHolder {
        return plainToInstance(WalletHolder, data);
    }
}