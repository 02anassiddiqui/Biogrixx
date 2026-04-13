const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';
const API_BASE = BASE.endsWith('/v1') ? BASE : `${BASE}/v1`;

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem("biogrix_auth_token") : null;

  // 🚀 IMPROVEMENT 1: Agar body object hai, toh khud stringify kar do
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // 🚀 IMPROVEMENT 2: Detailed 401 Handling
  if (response.status === 401 || response.status === 403) {
    console.warn(`🚨 Auth Failed on: ${path}. Redirecting to login...`);
    
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      localStorage.removeItem("biogrix_auth_token");
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Server Error');
  }

  return response.json();
}

export async function getHealth() {
  return apiRequest('/health');
}