import { UniqueEntityID } from "../UniqueEntityID";
import { IDomainEvent } from "./IDomainEvent";

export abstract class DomainEvent implements IDomainEvent {
  public occurredOn: Date = new Date();
  private _id: UniqueEntityID;
  public abstract payload;
  public initiator: object;
  constructor(id: string | UniqueEntityID) {
    this._id = typeof id === "string" ? new UniqueEntityID(id) : id;
  }

  public get aggregateId(): UniqueEntityID {
    return this._id;
  }

  public set aggregateId(id: UniqueEntityID) {
    this._id = id;
  }
}
