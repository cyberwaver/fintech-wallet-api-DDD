import { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent {
  occurredOn: Date;
  aggregateId: UniqueEntityID;
  payload: unknown;
  initiator: object;
}
