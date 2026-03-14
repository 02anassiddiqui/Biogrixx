/**
 * Payments controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../../../shared/utils/apiResponse')
const paymentsService = require('./payments.service')

exports.list = async (req, res) => {
  const result = await paymentsService.findAll()
  success(res, result)
}
