const Joi = require("joi");

/**
 * Validation Joi schema for login request
 */
module.exports = Joi.object({
  email: Joi.string()
    .email()
    .rule({ message: "Invalid email address." })
    .required(),
  password: Joi.string().required().strip(),
});
