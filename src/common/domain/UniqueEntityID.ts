
import shortUUID from 'short-uuid';
import {Identifier} from './Identifier'

export class UniqueEntityID extends Identifier<string | number>{
  constructor (id?: string | number) {
    super(id ? id : shortUUID.generate())
  }
}