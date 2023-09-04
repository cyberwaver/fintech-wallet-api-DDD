import * as shortUUID from 'short-uuid';
import { Identifier } from './Identifier';

export class UniqueEntityID extends Identifier<string | number> {
  public isNew = false;
  constructor(id?: string | number) {
    super(id ? id : shortUUID.generate());
    if (!id) this.isNew = true;
  }
}
