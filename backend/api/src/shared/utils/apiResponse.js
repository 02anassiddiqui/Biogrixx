/**
 * Shared API response utility.
 * Standardizes success and error responses.
 */

function success(res, data, message = '') {
  return res.json({
    success: true,
    data,
    message,
  })
}

function error(res, message, status = 500) {
  return res.status(status).json({
    success: false,
    data: null,
    message,
  })
}

module.exports = { success, error }
