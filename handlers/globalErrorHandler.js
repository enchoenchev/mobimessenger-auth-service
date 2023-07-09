const requestValidatorService = require("../services/requestValidator");

/**
 * Global error handler
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (err, req, res, next) => {
  if (err.name == "ValidationError") {
    err = requestValidatorService.normalizeError(err);
  }

  const errorObject = {
    name: err.name,
    code: err.status || 500,
    message: err.message || "",
    apiStatus: "error",
    data: err.data ? err.data : [],
    error: process.env.NODE_ENV === "development" ? err : {},
    stack: process.env.NODE_ENV === "development" ? err.stack : "",
    _error: err,
    _stack: err.stack,
  };

  // 404 general error
  if (errorObject.name == "NotFoundError") {
    errorObject.code = 404;
    errorObject.message = "Page Not Found";
  }

  // JWT secret key missing error
  if (errorObject.name == "JwtSecretMissingError") {
    errorObject.message = "Application secret key not defined";
  }

  if (
    req.originalUrl.startsWith("/" + (process.env.API_ROUTE_PREFIX || "api"))
  ) {
    // API request error, return JSON
    const jsonData = {
      status: errorObject.apiStatus,
      message: errorObject.message,
    };

    // 404 error
    if (errorObject.name == "NotFoundError") {
      errorObject.message = "Endpoint not found";
      jsonData.message = errorObject.message;
    }

    // Validation error
    if (errorObject.name == "ValidationError") {
      jsonData.message = errorObject.message;
      jsonData.data = errorObject.data;
    }
    if (errorObject.name == "RequestValidationError") {
      jsonData.message = errorObject.message;
      jsonData.data = errorObject.data;
    }

    // Include error details in Development Env
    if (process.env.NODE_ENV === "development") {
      jsonData.error = errorObject._error;
      jsonData.stack = errorObject._stack;
    }

    // Return JSON
    res.status(errorObject.code).json(jsonData);
  } else {
    // Web request error, return HTML
    res.locals.message = errorObject.message;
    res.locals.error = errorObject.error;
    res.status(errorObject.code);
    res.render("error");
  }
};
