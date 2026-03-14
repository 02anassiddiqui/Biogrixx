/**
 * Payments service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const paymentsRepository = require('./payments.repository')

exports.findAll = async () => {
  return paymentsRepository.findAll()
}
