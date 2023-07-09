const Joi = require("joi");

/**
 * Validation Joi schema for registration request
 */
module.exports = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .rule({ message: "Invalid email address." })
    .required(),
  password: Joi.string()
    .min(8)
    .rule({ message: "Password must be at least 8 characters long." })
    .required()
    .strip(),
});
