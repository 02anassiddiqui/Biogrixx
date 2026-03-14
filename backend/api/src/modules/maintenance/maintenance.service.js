/**
 * Maintenance service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const maintenanceRepository = require('./maintenance.repository')

exports.findAll = async () => {
  return maintenanceRepository.findAll()
}
