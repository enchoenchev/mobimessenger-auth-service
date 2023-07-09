const jwt = require("jsonwebtoken");
const JwtSecretMissingError = require("../handlers/jwtSecretMissingError");

/**
 * Create JWT token
 *
 * @param String data
 * @returns String
 */
exports.create = (data) => {
  if (!process.env.JWT_SECRET) {
    return next(new JwtSecretMissingError());
  }

  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN_DAYS || 30) * 60 * 60 * 24,
  });
};

/**
 * Verify JWT token
 *
 * @param String token
 * @returns Boolean
 */
exports.verify = (token, userId) => {
  if (!process.env.JWT_SECRET) {
    return next(new JwtSecretMissingError());
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return (payload && !userId) ||
      (payload && userId && payload.userId == userId)
      ? true
      : false;
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      // TODO
    } else if (err.name == "JsonWebTokenError") {
      // TODO
    } else {
      // TODO
    }
    // TODO
    return false;
  }
};
