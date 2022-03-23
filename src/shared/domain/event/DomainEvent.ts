import { UniqueEntityID } from "../UniqueEntityID";
import { IDomainEvent } from "./IDomainEvent";

export abstract class DomainEvent implements IDomainEvent {
    occurredOn: Date = new Date();
    constructor(public id: UniqueEntityID) {}

    public getAggregateId(): UniqueEntityID {
        return this.id;
    }
}