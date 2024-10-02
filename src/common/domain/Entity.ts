import { UniqueEntityID } from './UniqueEntityID';

export abstract class Entity<P extends { id: UniqueEntityID }> {
  private readonly id: UniqueEntityID;
  protected state: P;

  constructor(state?: P) {
    this.state = Object.create(state ?? {});
  }

  get ID(): UniqueEntityID {
    return this.state.id;
  }

  protected set<K extends keyof P>(key: K, value: P[K]): void {
    this.state[key] = value;
  }

  public equals(object?: Entity<P>): boolean {
    if (!object || !(object instanceof Entity)) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return this.id.equals(object.id);
  }

  public getProps(): P {
    return Object.create(this.state);
  }
}
