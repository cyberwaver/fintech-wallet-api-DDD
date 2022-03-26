import { DomainEvent } from "src/shared/domain/event/DomainEvent";
import { WalletDTO } from "../DTOs/WalletDTO";
import { Wallet } from "../Wallet";

export class WalletCreatedEvent extends DomainEvent {
    public wallet: WalletDTO
    constructor(wallet: Wallet) {
        super(wallet.ID);
        this.wallet = wallet.toDTO();
    }
}