// 🚀 CHANGE 1: Localhost hata kar Environment Variable check kiya
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

export const adminService = {
  // Saari leads lane ke liye
  getLeads: async () => {
    // 🚀 CHANGE 2: Headers mein 'x-admin-secret' add kiya taaki backend allow kare
    const res = await fetch(`${API_BASE}/customers`, {
      headers: {
        "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
      },
    });
    const data = await res.json();
    return data;
  },

  // Lead delete karne ke liye
  deleteLead: async (id) => {
    // 🚀 CHANGE 3: DELETE request mein bhi headers zaroori hain
    const res = await fetch(`${API_BASE}/customers/${id}`, { 
      method: 'DELETE',
      headers: {
        "x-admin-secret": localStorage.getItem("biogrix_admin_key"),
      },
    });
    return await res.json();
  }
};