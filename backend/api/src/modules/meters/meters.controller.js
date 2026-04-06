// backend/api/src/modules/meters/meters.controller.js
const meterService = require("./meters.service");
const { validateRegister, validateAssignment } = require("./meters.validation");

exports.getAllMeters = async (req, res) => {
  try {
    const meters = await meterService.getAllMeters();
    return res.status(200).json({ success: true, data: meters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerMeter = async (req, res) => {
  try {
    const { isValid, errors } = validateRegister(req.body);
    if (!isValid)
      return res.status(400).json({ success: false, message: errors[0] });

    const meter = await meterService.registerMeter(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Meter added to inventory",
        data: meter,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignMeter = async (req, res) => {
  try {
    const { isValid, errors } = validateAssignment(req.body);
    if (!isValid)
      return res.status(400).json({ success: false, message: errors[0] });

    const result = await meterService.assignMeterToCustomer(req.body);
    return res
      .status(200)
      .json({
        success: true,
        message: "Hardware assigned successfully!",
        data: result,
      });
  } catch (error) {
    console.error("❌ Assignment Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMeter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMeter = await meterService.updateMeter(id, req.body);
    return res.status(200).json({ 
      success: true, 
      message: "Meter updated successfully!", 
      data: updatedMeter 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingMeters = async (req, res) => {
  try {
    const pendingMeters = await meterService.getPendingMeters();
    return res.status(200).json({ 
      success: true, 
      count: pendingMeters.length,
      data: pendingMeters 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// backend/api/src/modules/meters/meters.controller.js

exports.deleteMeter = async (req, res) => {
  try {
    const { id } = req.params;
    await meterService.deleteMeter(id);
    
    return res.status(200).json({ 
      success: true, 
      message: "Meter inventory se permanently delete ho gaya!" 
    });
  } catch (error) {
    console.error("❌ Delete Controller Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};