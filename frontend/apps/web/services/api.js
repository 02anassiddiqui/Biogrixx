// 🚀 CHANGE 1: Hardcoded URL hata kar Environment Variable aur Fallback lagaya
// Taaki Vercel par Render ka URL chale aur local par localhost
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

// 🚀 CHANGE 2: Smart Path Check
// Agar Vercel mein URL ke peeche /v1 nahi hai, toh hum jodd denge
const API_BASE_URL = BASE.endsWith('/v1') ? BASE : `${BASE}/v1`;

export const leadService = {
  /**
   * Website form se naya kisan register karne ke liye
   */
  register: async (formData) => {
    // 🚀 CHANGE 3: Ab ye URL dynamic ho gaya hai
    const response = await fetch(`${API_BASE_URL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    
    // Extra Protection: Agar backend error de
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    
    return result;
  }
};