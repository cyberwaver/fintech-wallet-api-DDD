export class ApplicationException extends Error {
  constructor();
  constructor(message: string);
  constructor(
    public message = 'A application error occurred',
    public code?: string,
    public extras?: any,
  ) {
    super();
  }
}
