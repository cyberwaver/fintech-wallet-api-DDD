import { plainToInstance } from "class-transformer";
import { AggregateRoot } from "src/shared/domain/AggregateRoot";
import { NewWalletDTO, WalletDTO } from "./DTOs/index.dtos";
import { WalletCreatedEvent } from "./events/";
import { WalletStatus } from "./WalletStatus";
import { WalletType } from "./WalletType";

export class Wallet extends AggregateRoot<WalletDTO> {
    private name: string;
    private number: string;
    private type: WalletType;
    private status: WalletStatus;
    private balance: number;
    private createdAt: Date;
    private meta: object;

    constructor(props: WalletDTO) {
        super(props.id, WalletDTO);
        this.name = props.name;
        this.number = props.number;
        this.type = new WalletType(props.type);
        this.status = new WalletStatus(props.status);
        this.balance = props.balance;
        this.createdAt = props.createdAt || new Date();
        this.meta = props.meta;
    }

    static async Create(data: NewWalletDTO): Promise<Wallet> {
        const wallet = new Wallet(plainToInstance(WalletDTO, data));
        wallet.addDomainEvent(WalletCreatedEvent);
        return wallet;
    }
}