/**
 * Plants controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../../../shared/utils/apiResponse')
const plantsService = require('./plants.service')

exports.list = async (req, res) => {
  const result = await plantsService.findAll()
  success(res, result)
}

exports.getById = async (req, res) => {
  success(res, null)
}
