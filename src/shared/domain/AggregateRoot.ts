
import { ClassConstructor, instanceToInstance } from "class-transformer";
import { Entity } from "./Entity";
import { IDomainEvent } from "./event/IDomainEvent";
import { UniqueEntityID } from "./UniqueEntityID";

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent (domainEvent: ClassConstructor<IDomainEvent> | IDomainEvent): void {
    let domainEventInstance: IDomainEvent;
    if(isClassConstructor(domainEvent)) domainEventInstance = new domainEvent(this);
    else domainEventInstance = domainEvent;
    this._domainEvents.push(domainEventInstance);
    this.logDomainEventAdded(domainEventInstance);
  }

  public clearEvents (): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded (domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(`[Domain Event Created]:`, thisClass.constructor.name, '==>', domainEventClass.constructor.name)
  }
}

const isClassConstructor = (instanceOrClassConstructor: {}): instanceOrClassConstructor is ClassConstructor<{}> => {
  return !(instanceOrClassConstructor instanceof AggregateRoot)
}