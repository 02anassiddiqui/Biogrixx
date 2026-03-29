const API_BASE = 'http://localhost:4000/v1';

export const adminService = {
  // Saari leads lane ke liye
  getLeads: async () => {
    const res = await fetch(`${API_BASE}/customers`);
    const data = await res.json();
    return data;
  },

  // Lead delete karne ke liye (Backend routes mein DELETE banana padega)
  deleteLead: async (id) => {
    const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
    return await res.json();
  }
};