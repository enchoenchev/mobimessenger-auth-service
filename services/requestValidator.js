const Joi = require("joi");
const RequestValidationError = require("../handlers/requestValidationError");
const stringHelper = require("../helpers/string");

/**
 * Validate data agains predefined validation Joi schema
 * 
 * @param Object schema 
 * @param Array data 
 * @returns Array
 */
exports.validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
  });

  let errorData = [];

  if (!error) {
    return errorData;
  }

  for (element of error.details) {
    let message = element.message.trim().replaceAll('"', "");
    message = stringHelper.capitalizeFirstLetter(message);
    message = stringHelper.closeSentence(message);
    errorData.push({
      name: element.path.shift(),
      message: message
        ? message.charAt(0).toUpperCase() + message.slice(1)
        : "",
      type: element.type,
    });
  }

  return errorData;
};

/**
 * Create validation error
 * 
 * @param String message 
 * @param Array data 
 * @returns RequestValidationError
 */
exports.createValidationError = (message, data) => {
  return new RequestValidationError(
    message || "Request validation failed.",
    data
  );
};

/**
 * Validate data agains predefined validation Joi schema and create validation error
 * 
 * @param Object schema 
 * @param Array data 
 * @returns RequestValidationError
 */
exports.validateAndCreateError = (schema, data) => {
  const errors = module.exports.validate(schema, data);

  if (errors.length == 0) {
    return undefined;
  }

  return module.exports.createValidationError("", errors);
}

/**
 * Convert non-RequestValidationError to RequestValidationError
 * 
 * @param Error error 
 * @returns RequestValidationError
 */
exports.normalizeError = (error) => {
  const proxyError = {
    message: "",
    data: [],
  };

  if (error.name === "ValidationError") {
    proxyError.message = error._message;
    for (element of Object.values(error.errors)) {
      proxyError.data.push({
        name: element.properties.path,
        message: element.properties.message,
        type: element.properties.type,
      });
    }
  }

  return module.exports.createValidationError(
    proxyError.message,
    proxyError.data
  );
};
