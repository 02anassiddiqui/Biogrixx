/**
 * Customers service.
 * TODO: Implement business logic.
 * All database access goes through repository.
 */


/**
 * Customers service.
 * Business logic layer for customer/lead management.
 * Connects the Controller to the Repository.
 */
const customersRepository = require('./customers.repository');

/**
 * Nayi lead ko process aur register karne ke liye (Website Form)
 */
exports.registerLead = async (formData) => {
  // Aap yahan data validation ya formatting ka logic bhi daal sakte hain
  return await customersRepository.create(formData);
};

/**
 * Saari leads ki list nikalne ke liye (Admin Dashboard)
 */
exports.getAllLeads = async () => {
  return await customersRepository.findAll();
};

/**
 * Kisi specific lead ko delete karne ke liye
 */
exports.deleteCustomer = async (id) => {
  // Business rule: Check kar sakte hain ki id valid hai ya nahi
  if (!id) throw new Error("ID zaroori hai delete karne ke liye!");
  
  return await customersRepository.remove(id);
};