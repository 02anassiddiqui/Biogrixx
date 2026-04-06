const customersService = require('./customers.service');

// 🟢 AGENT APP: Kisan ki info fetch karna ID se
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customersService.getCustomerDetails(id);
    
    return res.status(200).json({
      success: true,
      message: "Customer data synced from grid",
      data: customer
    });
  } catch (error) {
    return res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 🔵 ADMIN: Saare customers ki list dekhna
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await customersService.getAllCustomers();
    return res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Sync failed" });
  }
};

// 🔵 ADMIN: Naya kisan register karna
exports.registerCustomer = async (req, res) => {
  try {
    const customer = await customersService.registerCustomer(req.body);
    return res.status(201).json({
      success: true,
      message: "Kisan registered successfully!",
      data: customer
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 🔵 ADMIN: Customer delete karna
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await customersService.deleteCustomer(id);
    return res.status(200).json({ 
      success: true, 
      message: "Customer decommissioned successfully" 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};