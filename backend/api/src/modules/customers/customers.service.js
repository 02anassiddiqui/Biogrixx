const customersRepository = require("./customers.repository");

// 1. Saare customers mangwana (Admin Dashboard ke liye)
exports.getAllCustomers = async () => {
  return await customersRepository.findAll();
};

// 2. Naya kisan register karna
// ✅ KEPT: Isse naye customers grid mein add honge
exports.registerCustomer = async (customerData) => {
  if (!customerData.name || !customerData.phone) {
    throw new Error("Kisan ka naam aur phone hona zaroori hai!");
  }
  return await customersRepository.create(customerData);
};

// 3. Customer ko decommission (delete) karna
exports.deleteCustomer = async (id) => {
  if (!id) throw new Error("Customer ID is required");
  return await customersRepository.remove(id);
};

// 4. Single Customer Details (Meter details ke saath)
// ✅ NEW: Ye Agent App ke liye 'Real Development' wala part hai
exports.getCustomerDetails = async (id) => {
  if (!id) throw new Error("ID dhoondne ke liye zaroori hai");
  
  const customer = await customersRepository.findById(id);
  
  if (!customer) {
    throw new Error("Kisan grid par nahi mila. ID check karein.");
  }
  
  return customer;
};