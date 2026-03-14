/**
 * Customers service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const customersRepository = require('./customers.repository')

exports.findAll = async () => {
  return customersRepository.findAll()
}
