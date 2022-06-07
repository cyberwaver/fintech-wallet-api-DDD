import { Type } from "class-transformer";
import { Entity } from "src/shared/domain/Entity";
import { UniqueEntityID } from "src/shared/domain/UniqueEntityID";
import { NewWalletTransactionDTO, WalletTransactionDTO } from "./DTOs/dtos.index";
import { WalletTransactionSignedEvent, WalletTxnCompletedEvent } from "./events/events.index";
import { WalletHolder } from "./WalletHolder";
import { WalletTransactionSignee } from "./WalletTransactionSignee";
import { WalletTransactionStatus } from "./WalletTransactionStatus";
import { WalletTransactionType } from "./WalletTransactionType";

export class WalletProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;
  walletId: string;
  @Type(() => WalletTransactionType)
  type: WalletTransactionType;
  amount: number;
  @Type(() => WalletTransactionStatus)
  status: WalletTransactionStatus;
  @Type(() => WalletTransactionSignee)
  signees: WalletTransactionSignee[];
  @Type(() => Date)
  createdAt: Date;
}

export class WalletTransaction extends Entity<WalletProps> {
  constructor(dto?: WalletTransactionDTO) {
    super(dto, WalletProps);
  }

  public get status(): WalletTransactionStatus {
    return this.props.status;
  }

  public get type(): WalletTransactionType {
    return this.props.type;
  }

  public get SIGNEES_COUNT(): number {
    return this.props.signees.length;
  }

  isASignee(holder: WalletHolder): boolean {
    return this.props.signees.some((s) => s.value.holderId === holder.ID.toString());
  }

  addASignee(holderId: string) {
    this.props.signees.push(new WalletTransactionSignee({ holderId }));
  }

  public static Create(request: NewWalletTransactionDTO): WalletTransaction {
    const transaction = new WalletTransaction(request);
    transaction.addASignee(request.holderId);
    return transaction;
  }

  private $whenWalletTransactionSignedEvent($event: WalletTransactionSignedEvent) {
    this.addASignee($event.payload.holderId);
  }

  private $whenWalletTxnCompletedEvent($event: WalletTxnCompletedEvent) {
    this.props.status = WalletTransactionStatus.Completed;
  }
}
