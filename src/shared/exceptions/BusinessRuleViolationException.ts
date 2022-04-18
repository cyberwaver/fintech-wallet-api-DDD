import { IBusinessRule } from "../domain/rule/IBusinessRule";

export class BusinessRuleViolationException extends Error {
  type: string;
  name: string;
  constructor(rule: IBusinessRule) {
    super(rule.message);
    this.type = "BusinessRuleViolationException";
    this.name = rule.name;
  }
}
