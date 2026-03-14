/**
 * Health controller.
 */

const { success } = require('../../../../shared/utils/apiResponse')

exports.check = (req, res) => {
  const data = { status: 'ok', timestamp: new Date().toISOString() }
  success(res, data, 'Service healthy')
}
