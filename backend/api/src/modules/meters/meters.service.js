/**
 * Meters service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const metersRepository = require('./meters.repository')

exports.findAll = async () => {
  return metersRepository.findAll()
}
