/**
 * Gas usage service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const gasUsageRepository = require('./gas-usage.repository')

exports.findAll = async () => {
  return gasUsageRepository.findAll()
}
