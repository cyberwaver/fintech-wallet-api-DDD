import { ApplicationException } from './ApplicationException';

export class NotFoundException extends ApplicationException {
  constructor(public message = 'Entity not found') {
    super();
  }
}

module.exports = NotFoundException;
