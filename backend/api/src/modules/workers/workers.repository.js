// backend/api/src/modules/worker/worker.repository.js
const { supabase } = require("../../shared/database/supabaseClient");

class WorkerRepository {
  async findAll() {
    return await supabase
      .from("workers")
      .select("*")
      .order("created_at", { ascending: false });
  }

  async findByPhone(phone) {
    return await supabase
      .from("workers")
      .select("*")
      .eq("phone", phone)
      .single();
  }

  async create(workerData) {
    return await supabase.from("workers").insert([workerData]).select();
  }

  async update(id, updateData) {
    return await supabase
      .from("workers")
      .update(updateData)
      .eq("id", id)
      .select();
  }

  async delete(id) {
    return await supabase.from("workers").delete().eq("id", id);
  }
}

module.exports = new WorkerRepository();
