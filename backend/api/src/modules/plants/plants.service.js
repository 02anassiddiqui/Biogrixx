const { supabase } = require("../../shared/database/supabaseClient");
const plantsRepository = require("./plants.repository");

exports.registerPlantWithVillage = async (plantData) => {
  // 1. Village ID fetch karo logic se
  const villageId = await plantsRepository.getOrCreateVillage(plantData.village_name);
  
  // 2. Plant data prepare karo DB ke liye
  const finalPlantData = {
    name: plantData.name,
    village_id: villageId, 
    capacity: plantData.capacity,
    installer_name: plantData.installer_name,
    status: plantData.status
  };

  // 3. Save to database
  return await plantsRepository.create(finalPlantData);
};

exports.fetchPlants = async () => {
  return await plantsRepository.findAll();
};

exports.removePlant = async (id) => {
  return await plantsRepository.remove(id);
};

exports.updatePlantStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('plants')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};