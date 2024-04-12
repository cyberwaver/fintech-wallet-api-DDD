import { HttpStatus } from '@nestjs/common';

export default class ResponseEntity<T = Record<string, string>> {
  private constructor(
    public status: 'failed' | 'success',
    public statusCode: HttpStatus,
    public message?: string,
    public data?: T,
  ) {}

  static ok<T>(msgOrData: T): ResponseEntity<T> {
    if (typeof msgOrData == 'string') return new ResponseEntity('success', HttpStatus.OK, msgOrData);
    return new ResponseEntity('success', HttpStatus.OK, undefined, msgOrData);
  }

  static accepted<T>(msgOrData: T): ResponseEntity<T> {
    if (typeof msgOrData == 'string') return new ResponseEntity('success', HttpStatus.ACCEPTED, msgOrData);
    return new ResponseEntity('success', HttpStatus.ACCEPTED, undefined, msgOrData);
  }

  static created<T>(msgOrData: T): ResponseEntity<T> {
    if (typeof msgOrData == 'string') return new ResponseEntity('success', HttpStatus.CREATED, msgOrData);
    return new ResponseEntity('success', HttpStatus.CREATED, undefined, msgOrData);
  }

  static error(message = 'An error occurred', statusCode = HttpStatus.BAD_REQUEST): ResponseEntity<unknown> {
    return new ResponseEntity('failed', statusCode, message);
  }
}
