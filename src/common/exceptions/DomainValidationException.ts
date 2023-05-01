import { ApplicationException } from './ApplicationException';

export class DomainValidationException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}
