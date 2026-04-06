const { supabase } = require("../../shared/database/supabaseClient");

/**
 * Village logic: Name se ID dhoondo, 
 * aur agar District/State NULL hain toh unhe "Smartly" repair karo.
 */
exports.getOrCreateVillage = async (villageName, district = null, state = null) => {
  // 1. Pehle gaon dhoondo (Fetch current district/state to check for NULLs)
  let { data: village, error } = await supabase
    .from('villages')
    .select('id, district, state')
    .eq('name', villageName)
    .maybeSingle();

  // 2. ✅ SMART REPAIR LOGIC:
  // Agar gaon mil gaya lekin usme District ya State missing hai, toh unhe update karo
  if (village) {
    const needsRepair = (!village.district || !village.state) && (district || state);
    
    if (needsRepair) {
      await supabase
        .from('villages')
        .update({ 
          district: village.district || district, 
          state: village.state || state 
        })
        .eq('id', village.id);
    }
    return village.id;
  }

  // 3. Agar gaon nahi mila, toh Naya banao with all details
  const { data: newVillage, error: createError } = await supabase
    .from('villages')
    .insert([{ 
      name: villageName, 
      district: district, 
      state: state 
    }])
    .select('id')
    .single();
  
  if (createError) throw createError;
  return newVillage.id;
};

exports.findAll = async () => {
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      villages ( name, district, state )
    `) // ✅ Fetching everything connected
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// exports.create = async (leadData) => {
//   const { data, error } = await supabase
//     .from("leads")
//     .insert([leadData])
//     .select(`*, villages(name)`)
//     .single();

//   if (error) throw error;
//   return data;
// };

//  Agar phone match kare toh update karo
exports.create = async (leadData) => {
  const { data, error } = await supabase
    .from("leads")
    .upsert([leadData], { 
      onConflict: 'phone', // Agar phone match kare toh update karo
      ignoreDuplicates: false 
    })
    .select(`*, villages(name)`)
    .single();

  if (error) throw error;
  return data;
};


exports.remove = async (id) => {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ... existing repository functions ...

exports.updateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};


// leads.repository.js mein add karo
exports.findByPhone = async (phone) => {
  const { data } = await supabase
    .from('leads')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();
  return data;
};

exports.findById = async (id) => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};