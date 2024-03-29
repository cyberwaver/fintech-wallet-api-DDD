import { IBusinessRule } from './IBusinessRule';

export abstract class BusinessRule implements IBusinessRule {
  name: string;
  abstract message: string;
  constructor() {
    this.name = this.constructor.name;
  }
  abstract isBroken(): boolean | Promise<boolean>;
}
