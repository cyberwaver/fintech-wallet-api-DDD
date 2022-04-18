export class DomainValidationException extends Error {
  constructor(message: string) {
    super(message);
  }
}
