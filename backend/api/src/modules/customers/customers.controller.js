/**
 * Customers controller.
 * TODO: Implement request handlers.
 */

// const { success } = require('../../../../shared/utils/apiResponse')
// const customersService = require('./customers.service')

// exports.list = async (req, res) => {
//   const result = await customersService.findAll()
//   success(res, result)
// }

// exports.getById = async (req, res) => {
//   success(res, null)
// }

/**
 * Customers controller.
 * Handles incoming HTTP requests and sends responses.
 */
const customersService = require("./customers.service");
// Note: Path check kar lena aapke shared folder ke hisaab se
const { sendSuccess, sendError } = require("../../../shared/utils/apiResponse");

/**
 * Jab kisan form submit karega
 */
exports.createCustomer = async (req, res) => {
  try {
    const lead = await customersService.registerLead(req.body);
    // Professional standard response use kar rahe hain
    return res.status(201).json({
      success: true,
      message: "Farmer lead registered successfully",
      data: lead,
    });
  } catch (error) {
    console.error("❌ Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Jab Admin Dashboard data maangega
 */
exports.getCustomers = async (req, res) => {
  try {
    const leads = await customersService.getAllLeads();
    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching leads",
      error: error.message,
    });
  }
};

// Jab Admin Delete button click karega

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params; // URL se ID nikalne ke liye
    await customersService.deleteCustomer(id);

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("❌ Controller Error (Delete):", error.message);
    return res.status(500).json({
      success: false,
      message: "Error deleting lead",
      error: error.message,
    });
  }
};
