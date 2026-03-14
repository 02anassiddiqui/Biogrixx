/**
 * API client for backend.
 * TODO: Add auth headers, error handling.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/v1'

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return response.json()
}

export async function getHealth() {
  return apiRequest('/health')
}
