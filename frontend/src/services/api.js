/**
 * Red Energy Meters API Service
 * Centralized API client for all backend communication
 */

// VITE_API_URL must be set - no fallbacks per PRINCIPLES.md
const API_BASE = import.meta.env.VITE_API_URL

if (!API_BASE) {
  throw new Error(
    'VITE_API_URL environment variable is not set. ' +
    'Create frontend/.env with: VITE_API_URL=http://localhost:4567 ' +
    'Or run: ./start_red_meters.rb which configures this automatically.'
  )
}

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new APIError(
        data.error || 'API request failed',
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(error.message, 0, null)
  }
}

// API Methods
export const api = {
  // Health
  getHealth: () => fetchAPI('/health'),

  // Analytics
  getOverview: () => fetchAPI('/api/v1/analytics/overview'),
  getGridHealth: () => fetchAPI('/api/v1/analytics/grid-health'),
  getCustomerSegments: () => fetchAPI('/api/v1/analytics/customer-segments'),
  getTransformerStats: () => fetchAPI('/api/v1/analytics/transformers'),

  // Meters
  getMeters: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI(`/api/v1/meters${query ? `?${query}` : ''}`)
  },
  getMeter: (id, includeReadings = false) => 
    fetchAPI(`/api/v1/meters/${id}${includeReadings ? '?include_readings=true' : ''}`),
  getMeterReadings: (id, params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI(`/api/v1/meters/${id}/readings${query ? `?${query}` : ''}`)
  },

  // Customers
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI(`/api/v1/customers${query ? `?${query}` : ''}`)
  },
  getCustomer: (id, includeMeters = false) => 
    fetchAPI(`/api/v1/customers/${id}${includeMeters ? '?include_meters=true' : ''}`),

  // Predictions
  getPredictions: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI(`/api/v1/predictions${query ? `?${query}` : ''}`)
  },
  runAnomalyDetection: (meterIds = null) => 
    fetchAPI('/api/v1/predictions/anomalies', {
      method: 'POST',
      body: JSON.stringify({ meter_ids: meterIds }),
    }),
  getDemandForecast: (hours = 72) => 
    fetchAPI(`/api/v1/predictions/demand-forecast?hours=${hours}`),

  // Alerts
  getAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI(`/api/v1/alerts${query ? `?${query}` : ''}`)
  },
  resolveAlert: (id, resolvedBy) => 
    fetchAPI(`/api/v1/alerts/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolved_by: resolvedBy }),
    }),
}

export { APIError }
export default api


