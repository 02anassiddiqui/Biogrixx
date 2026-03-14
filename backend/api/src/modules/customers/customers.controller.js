/**
 * Customers controller.
 * TODO: Implement request handlers.
 */

const { success } = require('../../../../shared/utils/apiResponse')
const customersService = require('./customers.service')

exports.list = async (req, res) => {
  const result = await customersService.findAll()
  success(res, result)
}

exports.getById = async (req, res) => {
  success(res, null)
}
