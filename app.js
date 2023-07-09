const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const logger = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./handlers/globalErrorHandler");
const rootRouter = require("./routes/index");
const db = require("./services/db");
require("dotenv").config();

/**
 * Create Express application
 */
const app = express();

/**
 * Parse application/json
 */
app.use(bodyParser.json());

/**
 * Parse application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Add API rate limiter
 */
const apiRateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});
const apiRoutePrefix = process.env.API_ROUTE_PREFIX || "api";
app.use("/" + apiRoutePrefix, apiRateLimiter);

/**
 * Secure HTTP response headers
 */
app.use(helmet());

/**
 * Secure against HTTP Parameter Pollution attacks
 */
app.use(hpp());

/**
 * Allow Cross-Origin requests
 */
app.use(cors());

/**
 * Sanitizes user-supplied data to prevent MongoDB Operator Injection
 */
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);

/**
 * Add logger
 */
app.use(logger("dev"));

/**
 * View engine setup
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/**
 * Cookie parser for web
 */
app.use(cookieParser());

/**
 * Define static content
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Hook all routes
 */
app.use("/", rootRouter);

/**
 * Handle undefined routes
 */
app.use("*", (req, res, next) => {
  const err = createError(404);
  next(err, req, res, next);
});

/**
 * Connection to DB
 */
db.connect();

/**
 * Set global error handler
 */
app.use(globalErrorHandler);

module.exports = app;
