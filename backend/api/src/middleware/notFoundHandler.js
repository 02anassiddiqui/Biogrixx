/**
 * 404 Not Found handler.
 */

const { error } = require("../../shared/utils/apiResponse");

function notFoundHandler(req, res, next) {
  error(res, "Route not found", 404);
}

module.exports = { notFoundHandler };
