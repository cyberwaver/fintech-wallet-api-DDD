import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
  constructor(
    message = 'A application error occurred',
    code = HttpStatus.BAD_REQUEST,
    meta?: Record<string, unknown>,
    cause?: Error,
  ) {
    meta = meta ?? {};
    super({ status: 'failed', statusCode: code, message, meta }, code, { cause });
    Object.assign(meta, { type: this.constructor.name });
  }
}
