
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { UniqueEntityID } from './UniqueEntityID';


export abstract class Entity<T> {
  private readonly id: UniqueEntityID;

  constructor(id: string, private readonly DTOClass: ClassConstructor<T>) {
      this.id = new UniqueEntityID(id);
  }

  get ID (): UniqueEntityID {
    return this.id;
  }

  public equals (object?: Entity<T>) : boolean {
    if (!object || !(object instanceof Entity)) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return this.id.equals(object.id);
  }

  public toDTO(): T {
    return plainToInstance(this.DTOClass, this);
  }
}