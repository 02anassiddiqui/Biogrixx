/**
 * Auth middleware.
 * TODO: Implement JWT validation.
 */

function authMiddleware(req, res, next) {
  // TODO: Validate JWT from Authorization header
  next()
}

module.exports = { authMiddleware }
