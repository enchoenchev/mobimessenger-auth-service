const GeneralError = require("../handlers/generalError");
const requestValidatorService = require("../services/requestValidator");
const loginValidationSchema = require("../validators/authLoginValidationSchema");
const registerValidationSchema = require("../validators/authRegisterValidationSchema");
const User = require("../models/user");
const jwtService = require("../services/jwt");

/**
 * Login action
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request parameters
    const validationError = requestValidatorService.validateAndCreateError(
      loginValidationSchema,
      req.body
    );

    // In case of validation errors, throw error
    if (validationError) {
      return next(validationError);
    }

    // Get a user matching the provided email
    const user = await User.findOne({ email: email })
      .select("+password")
      .exec();

    // Check if user exists and the password is correct. Throw error not fulfilled
    if (!user || !(await user.isValidPassword(password))) {
      return next(new GeneralError(401, "InvalidUserError", "Invalid user"));
    }

    // Generate JWT token
    const token = jwtService.create({
      userId: user.id,
      email: user.email,
    });

    // Strip password from user object
    user.password = undefined;

    // Return response
    res.status(200).json({
      status: "success",
      token: token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Register action
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate request parameters
  const validationError = requestValidatorService.validateAndCreateError(
    registerValidationSchema,
    req.body
  );

  // In case of validation errors, throw error
  if (validationError) {
    return next(validationError);
  }

  try {
    // Create a new user object
    const user = new User({
      name,
      email,
      password,
    });

    // Save the user
    await user.save();

    // Generate JWT token
    const token = jwtService.create({
      userId: user.id,
      email: user.email,
    });

    // Strip password from user object
    user.password = undefined;

    // Return response
    res.status(201).json({
      status: "success",
      token: token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Guard action
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.guard = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new GeneralError(401, "AuthenticationError", "User not authenticated")
      );
    }

    if (!jwtService.verify(token)) {
      return next(
        new GeneralError(401, "AuthenticationError", "User not authenticated")
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
