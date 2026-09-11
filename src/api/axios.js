import axios from 'axios'

// Ensure we reach the portfolio-server URL
// In development, this is typically http://localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
})

// Add a request interceptor to inject the token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Let browser set multipart/form-data boundary automatically for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
      if (config.headers.delete) {
        config.headers.delete('Content-Type')
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
