const plantsService = require("./plants.service");

exports.createPlant = async (req, res) => {
  try {
    const plant = await plantsService.registerPlantWithVillage(req.body);
    return res.status(201).json({ 
      success: true, 
      message: "Unit provisioned in grid", 
      data: plant 
    });
  } catch (error) {
    console.error("❌ Controller Error (createPlant):", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await plantsService.fetchPlants();
    return res.status(200).json({ success: true, data: plants });
  } catch (error) {
    console.error("❌ Controller Error (getAllPlants):", error.message);
    return res.status(500).json({ success: false, message: "Grid sync failed" });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    await plantsService.removePlant(req.params.id);
    return res.status(200).json({ success: true, message: "Unit decommissioned" });
  } catch (error) {
    console.error("❌ Controller Error (deletePlant):", error.message);
    return res.status(500).json({ success: false, message: "Delete operation failed" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedPlant = await plantsService.updatePlantStatus(id, status);
    return res.status(200).json({ success: true, data: updatedPlant });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};