const bcrypt = require("bcryptjs");

/**
 * Encrypt plain string
 *
 * @param String data
 * @returns String
 */
exports.encrypt = async (data) => {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds);
};

/**
 * Compare and verify plain string with encrypted one
 *
 * @param String data
 * @param String hash
 * @returns Boolean
 */
exports.verify = async (data, hash) => {
  return Boolean(await bcrypt.compare(data, hash));
};
