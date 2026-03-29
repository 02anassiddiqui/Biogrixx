/**
 * Global error handler middleware.
 */

const { error } = require("../shared/utils/apiResponse");

function errorHandler(err, req, res, next) {
  const message = err.message || "Internal server error";
  const status = err.status || err.statusCode || 500;
  error(res, message, status);
}

module.exports = { errorHandler };
