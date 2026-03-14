/**
 * Complaints controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../../../shared/utils/apiResponse')
const complaintsService = require('./complaints.service')

exports.list = async (req, res) => {
  const result = await complaintsService.findAll()
  success(res, result)
}
