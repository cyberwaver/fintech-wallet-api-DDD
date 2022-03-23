import { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent {
  occurredOn: Date;
  getAggregateId (): UniqueEntityID;
}