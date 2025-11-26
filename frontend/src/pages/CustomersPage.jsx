import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight,
  Sun,
  Car,
  Zap,
  X,
  PieChart
} from 'lucide-react'
import { api } from '../services/api'

function CustomerDetailPanel({ customer, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-energy-green/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-energy-green" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{customer.customer_hash}</h2>
                <p className="text-slate-400 text-sm capitalize">
                  {customer.segment_id?.replace(/_/g, ' ')}
                </p>
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
          {/* Segment Info */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-sm text-slate-400 mb-2">Customer Segment</h3>
            <p className="text-lg font-semibold text-white capitalize">
              {customer.segment_id?.replace(/_/g, ' ')}
            </p>
            {customer.segment_confidence && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-white">{customer.segment_confidence}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-energy-green rounded-full"
                    style={{ width: `${customer.segment_confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${
              customer.solar_installed 
                ? 'bg-energy-yellow/10 border-energy-yellow/30' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Sun className={`w-5 h-5 ${customer.solar_installed ? 'text-energy-yellow' : 'text-slate-500'}`} />
                <span className="text-sm font-medium text-white">Solar</span>
              </div>
              <p className={`text-sm ${customer.solar_installed ? 'text-energy-yellow' : 'text-slate-500'}`}>
                {customer.solar_installed ? 'Installed' : 'Not Installed'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              customer.ev_charging 
                ? 'bg-energy-blue/10 border-energy-blue/30' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Car className={`w-5 h-5 ${customer.ev_charging ? 'text-energy-blue' : 'text-slate-500'}`} />
                <span className="text-sm font-medium text-white">EV Charging</span>
              </div>
              <p className={`text-sm ${customer.ev_charging ? 'text-energy-blue' : 'text-slate-500'}`}>
                {customer.ev_charging ? 'Enabled' : 'Not Enabled'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              customer.demand_response_opted_in 
                ? 'bg-energy-green/10 border-energy-green/30' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className={`w-5 h-5 ${customer.demand_response_opted_in ? 'text-energy-green' : 'text-slate-500'}`} />
                <span className="text-sm font-medium text-white">Demand Response</span>
              </div>
              <p className={`text-sm ${customer.demand_response_opted_in ? 'text-energy-green' : 'text-slate-500'}`}>
                {customer.demand_response_opted_in ? 'Opted In' : 'Opted Out'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-white">Tariff</span>
              </div>
              <p className="text-sm text-slate-300 uppercase">
                {customer.tariff_type || 'Standard'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [segmentFilter, setSegmentFilter] = useState('')
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 })

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true)
        const params = { 
          limit: pagination.limit, 
          offset: pagination.offset 
        }
        if (segmentFilter) params.segment = segmentFilter
        
        const data = await api.getCustomers(params)
        setCustomers(data.customers)
        setPagination(prev => ({ ...prev, total: data.total }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [pagination.offset, pagination.limit, segmentFilter])

  const filteredCustomers = customers.filter(customer =>
    customer.customer_hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.segment_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">
            {pagination.total} customers across 12 segments
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={segmentFilter}
          onChange={(e) => setSegmentFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Segments</option>
          <option value="business_hours_commercial">Business Hours Commercial</option>
          <option value="evening_residential_peak">Evening Residential Peak</option>
          <option value="solar_battery_households">Solar Battery Households</option>
          <option value="ev_charging_households">EV Charging Households</option>
          <option value="efficiency_optimizers">Efficiency Optimizers</option>
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            No customers found
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className="card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-white font-medium">
                    {customer.customer_hash}
                  </p>
                  <p className="text-sm text-slate-400 capitalize mt-1">
                    {customer.segment_id?.replace(/_/g, ' ')}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </div>

              <div className="flex items-center gap-2">
                {customer.solar_installed && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-energy-yellow/10 rounded text-energy-yellow text-xs">
                    <Sun className="w-3 h-3" />
                    Solar
                  </div>
                )}
                {customer.ev_charging && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-energy-blue/10 rounded text-energy-blue text-xs">
                    <Car className="w-3 h-3" />
                    EV
                  </div>
                )}
                {customer.demand_response_opted_in && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-energy-green/10 rounded text-energy-green text-xs">
                    <Zap className="w-3 h-3" />
                    DR
                  </div>
                )}
                <div className="px-2 py-1 bg-slate-800 rounded text-slate-400 text-xs uppercase">
                  {customer.tariff_type}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between mt-6">
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

      {/* Detail Panel */}
      {selectedCustomer && (
        <CustomerDetailPanel 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  )
}

