export interface IBusinessRule {
  name: string;
  message: string;
  isBroken(): boolean | Promise<boolean>;
}
