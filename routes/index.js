const express = require("express");
const rootRouter = express.Router();
const webRouter = require("./web");
const apiRouter = require("./api");

// Build API route prefix path
const apiRoutePrefix = process.env.API_ROUTE_PREFIX || "api";
const apiUserVersioning = (process.env.API_VERSIONING_ENABLED === 'true' || process.env.API_VERSIONING_ENABLED === '1');
const apiVersion = apiUserVersioning
  ? "/v" + (process.env.API_VERSION || "1")
  : "";

// Hook web routes
rootRouter.use("/", webRouter);

// Hook API routes
rootRouter.use("/" + apiRoutePrefix + apiVersion, apiRouter);

module.exports = rootRouter;
