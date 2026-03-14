/**
 * Reports service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const reportsRepository = require('./reports.repository')

exports.findAll = async () => {
  return reportsRepository.findAll()
}
