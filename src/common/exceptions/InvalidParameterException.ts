import { ApplicationException } from './ApplicationException';

export class InvalidParameterException extends ApplicationException {
  constructor(key: string, message = 'is undefined or not accepted') {
    super(`${key}: ${message}`);
  }

  // static of(classOrFn, key) {
  //   return n
  // }
}

module.exports = InvalidParameterException;
