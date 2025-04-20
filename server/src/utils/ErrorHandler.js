class ErrorHandler extends Error {
  constructor(
    statusCode = 400,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.reason = message;
    this.error = error;
    if (this.stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ErrorHandler;
