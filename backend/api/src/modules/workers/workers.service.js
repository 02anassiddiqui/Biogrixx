// backend/api/src/modules/worker/worker.service.js
const workerRepository = require("./workers.repository");

class WorkerService {
  async getAllWorkers() {
    const { data, error } = await workerRepository.findAll();
    if (error) throw new Error(error.message);
    return data;
  }

  async register(workerData) {
    const { data: existing } = await workerRepository.findByPhone(
      workerData.phone,
    );
    if (existing) throw new Error("Agent with this phone already exists!");
    const { data, error } = await workerRepository.create(workerData);
    if (error) throw new Error(error.message);
    return data[0];
  }

  async update(id, updateData) {
    if (updateData.phone) {
      const { data: existing } = await workerRepository.findByPhone(
        updateData.phone,
      );
      if (existing && existing.id !== id)
        throw new Error("Phone number already assigned to another agent.");
    }
    const { data, error } = await workerRepository.update(id, updateData);
    if (error) throw new Error(error.message);
    return data[0];
  }

  async login(phone, password) {
    const { data: worker, error } = await workerRepository.findByPhone(phone);
    if (error || !worker) throw new Error("Agent not found!");
    if (worker.password !== password) throw new Error("Invalid Passcode!");
    if (worker.status !== "active")
      throw new Error("Account is inactive. Contact Admin.");
    return worker;
  }
}

module.exports = new WorkerService();
