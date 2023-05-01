import { IBusinessRule } from '../domain/rule/IBusinessRule';
import { ApplicationException } from './ApplicationException';

export class BusinessRuleViolationException extends ApplicationException {
  type: string;
  name: string;
  constructor(rule: IBusinessRule) {
    super(rule.message);
    this.type = 'BusinessRuleViolationException';
    this.name = rule.name;
  }
}
