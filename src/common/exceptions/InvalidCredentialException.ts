import { ApplicationException } from './ApplicationException';

export class InvalidCredentialException extends ApplicationException {
  constructor(message = 'Invalid credentials supplied.') {
    super(message);
  }
}

module.exports = InvalidCredentialException;
