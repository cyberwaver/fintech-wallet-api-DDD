import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './ApplicationException';

export class InvalidParameterException extends ApplicationException {
  constructor(key: string, message = 'is undefined or not accepted') {
    super(`${key}: ${message}`, HttpStatus.BAD_REQUEST);
  }
}
