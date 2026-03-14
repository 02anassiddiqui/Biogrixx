/**
 * Plants service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const plantsRepository = require('./plants.repository')

exports.findAll = async () => {
  return plantsRepository.findAll()
}
