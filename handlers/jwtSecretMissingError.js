/**
 * JWT secret missing error
 */
class JwtSecretMissingError extends Error {
  /**
   * Constructor
   * 
   * @param String message 
   */
  constructor(message) {
    super(message);
    this.name = "JwtSecretMissingError";
    this.message = message;
    this.status = 500;
  }
}

module.exports = JwtSecretMissingError;
