const leadService = require("./leads.service");
const customerRepo = require('../customers/customers.repository');
const meterRepo = require('../meters/meters.repository'); 

// 1. Lead Register karna
exports.registerLead = async (req, res) => {
  try {
    const lead = await leadService.registerLead(req.body);
    return res.status(201).json({
      success: true,
      message: "Lead registered and connected to village hub",
      data: lead,
    });
  } catch (error) {
    console.error("❌ Lead Controller Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Saare Leads fetch karna
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await leadService.getAllLeads();
    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Sync failed" });
  }
};

// 3. Lead delete karna
exports.deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);
    return res.status(200).json({ success: true, message: "Lead removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// 4. Lead status update karna
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLead = await leadService.updateStatus(id, status);

    return res.status(200).json({ 
      success: true, 
      message: "Lead status updated successfully", 
      data: updatedLead 
    });
  } catch (error) {
    console.error("❌ Controller Error (updateStatus):", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};


// 🔥 REAL DEVELOPMENT: Lead to Customer Conversion (Profile Only)
exports.convertToCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { plant_id } = req.body; // ✅ Frontend se sirf plant_id aa rahi hai

    console.log(`🚀 Starting conversion for Lead ID: ${id}`);

    // 1. Lead details fetch karo
    const lead = await leadService.getLeadById(id); 
    if (!lead) throw new Error("Lead record not found in system.");

    // 2. Customer record create karo (Profile setup)
    const customer = await customerRepo.create({
      name: lead.name,
      phone: lead.phone,
      village_id: lead.village_id,
      livestock_count: lead.livestock_count,
      plant_id: plant_id,
      meter_number: null // ✅ Baad mein Meters Section se update hoga
    });

    // 🔍 DEBUG LOG
    console.log("✅ Customer Profile Created:", customer?.id);

    if (!customer || !customer.id) {
      throw new Error("Customer creation failed - No UUID returned from DB.");
    }

    // 🔴 Step 3 (Meters Table entry) ko yahan se HATA DIYA HAI 
    // Kyunki assignment ab alag section mein hoga.

    // 4. Lead status update karo (Final Step)
    await leadService.updateStatus(id, 'converted');

    return res.status(200).json({ 
      success: true, 
      message: "Badhai ho! Kisan ab Customer list mein hai. Meters section mein jaakar ID assign karein.", 
      data: customer 
    });

  } catch (error) {
    console.error("❌ CONVERSION CRASHED:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Conversion Failed: " + error.message 
    });
  }
};

