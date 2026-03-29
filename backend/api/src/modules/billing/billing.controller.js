/**
 * Billing controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../shared/utils/apiResponse')
const billingService = require('./billing.service')

exports.list = async (req, res) => {
  const result = await billingService.findAll()
  success(res, result)
}
