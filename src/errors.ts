// When adding to this file, refer to
// https://developer.here.com/documentation/traffic/topics/http-status-codes.html for status codes
/* istanbul ignore file */

type ErrorName = 'InvalidParametersError' | 'CustomError';

export class HttpException extends Error {
  code: number;
  message: string;
  name: ErrorName;

  constructor(message: string, code = 500) {
    super(message);
    this.code = code;
    this.message = message;
    this.name = 'CustomError';
  }
}

export class InvalidParametersError extends HttpException {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidParametersError';
  }
}
