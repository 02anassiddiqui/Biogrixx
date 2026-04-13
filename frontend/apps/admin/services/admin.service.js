import { apiRequest } from './api'; // ✅ Global wrapper ko import kiya

export const adminService = {
  // Saari leads lane ke liye
  getLeads: async () => {
    // ✅ Ab sirf path dena hai, headers automatic lag jayenge
    return await apiRequest('/customers');
  },

  // Lead delete karne ke liye
  deleteLead: async (id) => {
    return await apiRequest(`/customers/${id}`, { 
      method: 'DELETE' 
    });
  },

  // 🚀 Naya: Password change karne ke liye
  changePassword: async (oldPassword, newPassword) => {
    return await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword })
    });
  }
};