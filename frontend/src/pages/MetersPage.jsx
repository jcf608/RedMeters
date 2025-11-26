import { useState, useEffect } from 'react'
import { 
  Gauge, 
  Search, 
  Filter, 
  ChevronRight,
  Activity,
  Zap,
  Clock,
  X
} from 'lucide-react'
import { api } from '../services/api'

function MeterDetailPanel({ meter, onClose }) {
  const [readings, setReadings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReadings() {
      try {
        const data = await api.getMeterReadings(meter.id, { limit: 50 })
        setReadings(data.readings)
      } catch (err) {
        console.error('Failed to load readings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReadings()
  }, [meter.id])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-energy-blue/20 flex items-center justify-center">
                <Gauge className="w-6 h-6 text-energy-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{meter.meter_number}</h2>
                <p className="text-slate-400 text-sm">{meter.meter_type}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  meter.status === 'active' ? 'bg-energy-green' : 'bg-slate-500'
                }`} />
                <span className="text-white font-medium capitalize">{meter.status}</span>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Installed</p>
              <p className="text-white font-medium mt-1">
                {meter.installed_at ? new Date(meter.installed_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Recent Readings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Readings</h3>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading readings...</div>
            ) : readings?.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {readings.slice(0, 20).map((reading, idx) => (
                  <div 
                    key={reading.id || idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      reading.quality_flag === 'anomaly' 
                        ? 'bg-energy-red/10 border border-energy-red/30' 
                        : 'bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300 text-sm">
                        {new Date(reading.reading_time).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white font-mono">
                        {reading.consumption_kwh?.toFixed(3)} kWh
                      </span>
                      <span className="text-slate-400">
                        {reading.voltage?.toFixed(1)}V
                      </span>
                      {reading.quality_flag === 'anomaly' && (
                        <span className="px-2 py-0.5 bg-energy-red/20 text-energy-red text-xs rounded-full">
                          Anomaly
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No readings available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MetersPage() {
  const [meters, setMeters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMeter, setSelectedMeter] = useState(null)
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 })

  useEffect(() => {
    async function loadMeters() {
      try {
        setLoading(true)
        const data = await api.getMeters({ 
          limit: pagination.limit, 
          offset: pagination.offset 
        })
        setMeters(data.meters)
        setPagination(prev => ({ ...prev, total: data.total }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMeters()
  }, [pagination.offset, pagination.limit])

  const filteredMeters = meters.filter(meter =>
    meter.meter_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meter.meter_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusColors = {
    active: 'bg-energy-green',
    inactive: 'bg-slate-500',
    maintenance: 'bg-energy-orange',
    decommissioned: 'bg-slate-700'
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Smart Meters</h1>
          <p className="text-slate-400 mt-1">
            {pagination.total} meters in the network
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search meters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Meters Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="table-header px-4 py-3">Meter Number</th>
              <th className="table-header px-4 py-3">Type</th>
              <th className="table-header px-4 py-3">Status</th>
              <th className="table-header px-4 py-3">Installed</th>
              <th className="table-header px-4 py-3">Customer ID</th>
              <th className="table-header px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  Loading meters...
                </td>
              </tr>
            ) : filteredMeters.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No meters found
                </td>
              </tr>
            ) : (
              filteredMeters.map((meter) => (
                <tr 
                  key={meter.id}
                  className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedMeter(meter)}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Gauge className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="font-mono font-medium text-white">
                        {meter.meter_number}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell capitalize">{meter.meter_type || '—'}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColors[meter.status]}`} />
                      <span className="capitalize">{meter.status}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {meter.installed_at 
                      ? new Date(meter.installed_at).toLocaleDateString() 
                      : '—'}
                  </td>
                  <td className="table-cell font-mono text-slate-500">
                    {meter.customer_id || '—'}
                  </td>
                  <td className="table-cell">
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))}
                disabled={pagination.offset === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, offset: p.offset + p.limit }))}
                disabled={pagination.offset + pagination.limit >= pagination.total}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedMeter && (
        <MeterDetailPanel 
          meter={selectedMeter} 
          onClose={() => setSelectedMeter(null)} 
        />
      )}
    </div>
  )
}

