/**
 * Gas usage controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../../../shared/utils/apiResponse')
const gasUsageService = require('./gas-usage.service')

exports.list = async (req, res) => {
  const result = await gasUsageService.findAll()
  success(res, result)
}
