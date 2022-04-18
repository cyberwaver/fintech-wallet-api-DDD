import { plainToInstance, ClassConstructor, plainToClassFromExist } from "class-transformer";
import { DomainEvent } from "./event/DomainEvent";
import { UniqueEntityID } from "./UniqueEntityID";

export abstract class Entity<P extends { id: UniqueEntityID }> {
  private readonly id: UniqueEntityID;
  protected props: P;
  private __dto = {};

  constructor(dto: object, private readonly PropsClass: ClassConstructor<P>) {
    dto = dto || { id: new UniqueEntityID().toString() };
    this.props = new Proxy(plainToInstance(this.PropsClass, dto), this._proxyHandler.call(this));
    this.__dto = dto;
  }

  get ID(): UniqueEntityID {
    return this.props.id;
  }

  protected set<K extends keyof P>(key: K, value: P[K]): void {
    this.props[key] = value;
  }

  public apply<T extends DomainEvent>(event: T): void {}

  public equals(object?: Entity<P>): boolean {
    if (!object || !(object instanceof Entity)) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return this.id.equals(object.id);
  }

  protected mapToProps<T extends object>(dto: T): void {
    this.props = new Proxy(plainToClassFromExist(this.props, dto), this._proxyHandler.call(this));
  }

  private _proxyHandler(): object {
    return {
      set: (_: any, prop: string, value: any) => {
        this._handleDTOupdate(prop, value);
        Reflect.get.apply(null, arguments);
      },
    };
  }

  private _handleDTOupdate(prop: string, value: unknown) {}
}
