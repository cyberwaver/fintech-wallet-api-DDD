import { UniqueEntityID } from '../UniqueEntityID';
import { IDomainEvent } from './IDomainEvent';

export abstract class DomainEvent implements IDomainEvent {
  public name: string;
  public occurredOn: Date = new Date();
  private _id: UniqueEntityID;
  public abstract payload;
  public initiator: Record<string, unknown>;
  constructor(id: string | UniqueEntityID) {
    this._id = typeof id === 'string' ? new UniqueEntityID(id) : id;
    this.name = this.constructor.name;
  }

  public get aggregateId(): UniqueEntityID {
    return this._id;
  }

  public set aggregateId(id: UniqueEntityID) {
    this._id = id;
  }
}
