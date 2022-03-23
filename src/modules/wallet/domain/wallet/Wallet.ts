import { plainToInstance } from "class-transformer";
import { AggregateRoot } from "src/shared/domain/AggregateRoot";
import { NewWalletDTO } from "./DTOs/index.dtos";
import { WalletCreatedEvent } from "./events/WalletCreatedEvent";
import { WalletType } from "./WalletType";

export class Wallet extends AggregateRoot<WalletDTO> {
    private amount: number;
    private type: WalletType;
    private createdAt: Date;
    private meta: object;

    constructor(props: WalletDTO) {
        super(props.id, WalletDTO);
        this.amount = props.amount;
        this.type = new WalletType(props.type);
        this.createdAt = props.createdAt || new Date();
        this.meta = props.meta;
    }

    static async Create(data: NewWalletDTO): Promise<Wallet> {
        const Wallet = new Wallet(plainToInstance(WalletDTO, txnData));
        Wallet.addDomainEvent(WalletCreatedEvent);
        return Wallet;
    }
}