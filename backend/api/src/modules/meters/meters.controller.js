/**
 * Meters controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../shared/utils/apiResponse')
const metersService = require('./meters.service')

exports.list = async (req, res) => {
  const result = await metersService.findAll()
  success(res, result)
}
