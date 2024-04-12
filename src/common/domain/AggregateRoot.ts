import { Type } from '@nestjs/common';
import { DomainRuleViolationException } from '../exceptions/DomainRuleViolationException';
import { Entity } from './Entity';
import { DomainEvent } from './event/DomainEvent';
import { IDomainEvent } from './event/IDomainEvent';
import { IBusinessRule } from './rule/IBusinessRule';
import { UniqueEntityID } from './UniqueEntityID';
import { convertDomainPropsToObject } from '@Common/utils/domain.utils';

export abstract class AggregateRoot<P extends { id: UniqueEntityID }> extends Entity<P> {
  private _domainEvents: IDomainEvent[] = [];

  get name(): string {
    return this.constructor.name;
  }

  checkRule(rule: IBusinessRule): void | Promise<void> {
    const isBroken = rule.isBroken();
    if (isBroken instanceof Promise) return this.resolveAsyncBusinessRule(isBroken, rule);
    if (!isBroken) return;
    throw new DomainRuleViolationException(rule);
  }

  async checkRuleAsync(rule: IBusinessRule): Promise<void> {
    return this.resolveAsyncBusinessRule(rule.isBroken() as Promise<boolean>, rule);
  }

  private async resolveAsyncBusinessRule(promise: Promise<boolean>, rule: IBusinessRule): Promise<void> {
    const isBroken = await Promise.resolve(promise);
    if (!isBroken) return;
    throw new DomainRuleViolationException(rule);
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public isDomainEventRaised(clazz: Type<DomainEvent>): boolean {
    return this._domainEvents.some((event) => event instanceof clazz);
  }

  private addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
    this.logDomainEventAdded(domainEvent);
  }

  public apply(event: DomainEvent): void {
    this.addDomainEvent(event);
    this.syncEventPayload(event);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private syncEventPayload(event: DomainEvent): void {
    const method = this[`$on${event.name}`];
    if (typeof method !== 'function') return;
    // console.log({ method, event });
    method.call(this, event);
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    // const thisClass = Reflect.getPrototypeOf(this);
    // const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    // console.info(
    //   `[Domain Event Created]:`,
    //   thisClass.constructor.name,
    //   '==>',
    //   domainEventClass.constructor.name,
    // );
  }

  protected find<T extends Entity<any>>(entities: T[], id: UniqueEntityID | string): T {
    if (typeof id == 'string') id = new UniqueEntityID(id);
    return entities.find((entity) => entity.ID.equals(id));
  }

  public toObject(): Record<string, unknown> {
    return convertDomainPropsToObject(this.props);
  }

  public toJSON(): string {
    return JSON.parse(JSON.stringify(this.props));
  }
}
