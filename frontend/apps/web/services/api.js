/**
 * API client for backend.
 * TODO: Add auth headers, error handling.
 */

// const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/v1'

// export async function apiRequest(path, options = {}) {
//   const url = path.startsWith('http') ? path : `${API_BASE}${path}`
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   })
//   return response.json()
// }

// export async function getHealth() {
//   return apiRequest('/health')
// }

const API_BASE_URL = 'http://localhost:4000/v1';

export const leadService = {
  /**
   * Website form se naya kisan register karne ke liye
   */
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Registration failed');
    return result;
  }
};