/**
 * Billing service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const billingRepository = require('./billing.repository')

exports.findAll = async () => {
  return billingRepository.findAll()
}
