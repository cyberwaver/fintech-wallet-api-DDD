import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './ApplicationException';

export class NotFoundException extends ApplicationException {
  constructor(public message = 'Entity not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
