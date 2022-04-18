import { ClassConstructor, instanceToInstance } from "class-transformer";
import { BusinessRuleViolationException } from "../exceptions/BusinessRuleViolationException";
import { Entity } from "./Entity";
import { DomainEvent } from "./event/DomainEvent";
import { IDomainEvent } from "./event/IDomainEvent";
import { IBusinessRule } from "./rule/IBusinessRule";
import { UniqueEntityID } from "./UniqueEntityID";

export abstract class AggregateRoot<P extends { id: UniqueEntityID }> extends Entity<P> {
  private _domainEvents: IDomainEvent[] = [];

  async checkRule(rule: IBusinessRule) {
    const isBroken = await rule.isBroken();
    if (!isBroken) return;
    throw new BusinessRuleViolationException(rule);
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
    this.logDomainEventAdded(domainEvent);
  }

  public apply(event: DomainEvent): void {
    super.apply(event);
    this.addDomainEvent(event);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(
      `[Domain Event Created]:`,
      thisClass.constructor.name,
      "==>",
      domainEventClass.constructor.name,
    );
  }
}

const isClassConstructor =
  (instanceOrClassConstructor: {}): instanceOrClassConstructor is ClassConstructor<{}> => {
    return !(instanceOrClassConstructor instanceof AggregateRoot);
  };
