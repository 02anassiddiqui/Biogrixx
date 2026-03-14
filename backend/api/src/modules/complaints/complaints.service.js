/**
 * Complaints service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */

const complaintsRepository = require('./complaints.repository')

exports.findAll = async () => {
  return complaintsRepository.findAll()
}
