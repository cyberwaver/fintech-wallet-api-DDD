import { HttpStatus } from '@nestjs/common';
import { IBusinessRule } from '../domain/rule/IBusinessRule';
import { ApplicationException } from './ApplicationException';

export class DomainRuleViolationException extends ApplicationException {
  constructor(rule: IBusinessRule) {
    super(rule.message, HttpStatus.BAD_REQUEST, { rule: rule.name });
    this.name = 'DomainRuleViolationException';
  }
}
