/**
 * Reports controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../shared/utils/apiResponse')
const reportsService = require('./reports.service')

exports.list = async (req, res) => {
  const result = await reportsService.findAll()
  success(res, result)
}
