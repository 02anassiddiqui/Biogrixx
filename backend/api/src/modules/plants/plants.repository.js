const { supabase } = require('../../shared/database/supabaseClient');

/**
 * Village logic: Village name se ID dhoondta hai, nahi toh naya banata hai.
 */
exports.getOrCreateVillage = async (villageName) => {
  let { data: village, error } = await supabase
    .from('villages')
    .select('id')
    .eq('name', villageName)
    .maybeSingle();

  if (error) throw error;

  if (!village) {
    const { data: newVillage, error: createError } = await supabase
      .from('villages')
      .insert([{ name: villageName }])
      .select('id')
      .single();
    
    if (createError) throw createError;
    return newVillage.id;
  }
  return village.id;
};

exports.create = async (plantData) => {
  const { data, error } = await supabase
    .from('plants')
    .insert([plantData])
    .select(`*, villages ( name )`)
    .single();

  if (error) throw error;
  return data;
};

exports.findAll = async () => {
  const { data, error } = await supabase
    .from('plants')
    .select(`*, villages ( name )`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

exports.remove = async (id) => {
  const { error } = await supabase.from('plants').delete().eq('id', id);
  if (error) throw error;
  return true;
};