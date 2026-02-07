const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "dev-key-12345"

export async function api(path, options = {}) {
  const url = `${BASE_URL}${path}`
  
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    ...options.headers,
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || `HTTP ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error(`API Error (${path}):`, error)
    throw error
  }
}
