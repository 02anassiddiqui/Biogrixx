// 🚀 CHANGE 1: '/v1' ko handle karne ka safe tareeka
// Hum check karenge ki agar URL mein pehle se /v1 hai, toh dobara na jodein
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
const API_BASE = BASE.endsWith('/v1') ? BASE : `${BASE}/v1`;

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  
  // 🚀 CHANGE 2: Browser storage se admin key uthana
  const adminKey = typeof window !== 'undefined' ? localStorage.getItem("biogrix_admin_key") : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // 🚀 CHANGE 3: Authentication header hamesha saath jayega
      ...(adminKey && { 'x-admin-secret': adminKey }),
      ...options.headers,
    },
  });

  // Basic error handling taaki crash na ho
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Server Error');
  }

  return response.json();
}

export async function getHealth() {
  // health check path usually /v1/health ya seedhe /health hota hai
  // Aapke backend ke hisab se change kar sakte hain
  return apiRequest('/health');
}
