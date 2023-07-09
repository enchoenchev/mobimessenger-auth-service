/**
 * Request validation error
 */
class RequestValidationError extends Error {
  /**
   * Constructor
   * 
   * @param String message 
   * @param Array data 
   */
  constructor(message, data) {
    super(message);
    this.name = "RequestValidationError";
    this.message = message;
    this.status = 422;
    this.data = data;
  }
}

module.exports = RequestValidationError;