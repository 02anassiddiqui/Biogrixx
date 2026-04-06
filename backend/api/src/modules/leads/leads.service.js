const leadsRepository = require('./leads.repository');

/**
 * Nayi lead register karne ka logic
 */
exports.registerLead = async (formData) => {
  let district = null;
  let state = null;

  
  // 🚀 Step 1: SMART PARSING
  // Agar kisan ne "Mehsana, Gujarat" likha hai, toh usey tod kar separate karo
  if (formData.location_details && formData.location_details.includes(',')) {
    const parts = formData.location_details.split(',').map(s => s.trim());
    district = parts[0]; // Pehla hissa: District
    state = parts[1];    // Doosra hissa: State
  } else if (formData.location_details) {
    // Agar comma nahi hai, toh poore text ko district maan lo
    district = formData.location_details.trim();
  }

  const existingLead = await leadsRepository.findByPhone(formData.phone);
  if (existingLead) {
    throw new Error("This phone number is already registered! We will contact you soon.");
  }

  // 🚀 Step 2: GET/CREATE VILLAGE (With Smart Repair)
  // Hum repository ko 3 cheezein bhej rahe hain
  const villageId = await leadsRepository.getOrCreateVillage(
    formData.village, 
    district, 
    state
  );

  // 🚀 Step 3: PREPARE FINAL DATA
  const processedData = {
    name: formData.name,
    phone: formData.phone,
    village_id: villageId, // Relational Link
    livestock_count: parseInt(formData.livestock_count) || 0, // Ensure it's a number
    role: formData.role || 'farmer',
    status: 'pending', // Default status for new leads
    message: formData.message,
    location_details: formData.location_details 
  };

  // 🚀 Step 4: SAVE TO DATABASE
  return await leadsRepository.create(processedData);
};

/**
 * Saari leads fetch karne ke liye (Admin Dashboard)
 */
exports.getAllLeads = async () => {
  return await leadsRepository.findAll();
};

/**
 * Lead delete karne ke liye
 */
exports.deleteLead = async (id) => {
  if (!id) throw new Error("ID is required for deletion");
  return await leadsRepository.remove(id);
};

exports.updateStatus = async (id, status) => {
  if (!id || !status) throw new Error("ID and Status are required");
  return await leadsRepository.updateStatus(id, status);
};

exports.getLeadById = async (id) => {
  return await leadsRepository.findById(id);
};

