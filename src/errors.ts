// When adding to this file, refer to 
// https://developer.here.com/documentation/traffic/topics/http-status-codes.html for status codes

class CustomError extends Error {
  errorCode: number;
  message: string;
  name: string;

  constructor(message: string, errorCode = 500) {
    super(message);
    this.errorCode = errorCode;
    this.message = message;
    this.name = "CustomError";
  }
}

export class InvalidParameterError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = "InvalidParameterError";
  }
}
