/**
 * Request logger middleware.
 * TODO: Implement structured request logging.
 */

function requestLogger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    // TODO: Log request details (method, path, status, duration)
  })
  next()
}

module.exports = { requestLogger }
