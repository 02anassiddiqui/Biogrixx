/**
 * Maintenance controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../../../shared/utils/apiResponse')
const maintenanceService = require('./maintenance.service')

exports.list = async (req, res) => {
  const result = await maintenanceService.findAll()
  success(res, result)
}
