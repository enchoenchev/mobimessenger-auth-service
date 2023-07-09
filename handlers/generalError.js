/**
 * General error
 */
class GeneralError extends Error {
  /**
   * Constructor
   * 
   * @param Number status 
   * @param String name 
   * @param String message 
   */
  constructor(status, name, message) {
    super(name, message);
    this.name = name;
    this.message = message;
    this.status = status;
  }
}

module.exports = GeneralError;
