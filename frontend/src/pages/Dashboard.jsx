import { useState, useEffect } from 'react'
import { 
  Gauge, 
  Users, 
  Zap, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock
} from 'lucide-react'
import { api } from '../services/api'

function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) {
  const colorClasses = {
    red: 'stat-card-red',
    orange: 'stat-card-orange',
    green: 'stat-card-green',
    blue: 'stat-card-blue',
  }

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-white mt-1">
            {value ?? '—'}
          </p>
          {subtitle && (
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-slate-800/50`}>
          <Icon className={`w-6 h-6 text-energy-${color}`} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-energy-green" />
          ) : (
            <TrendingDown className="w-4 h-4 text-energy-red" />
          )}
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-energy-green' : 'text-energy-red'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-500 text-sm ml-1">vs last hour</span>
        </div>
      )}
    </div>
  )
}

function GridHealthCard({ data }) {
  if (!data) return null

  const voltageStatus = data.avg_voltage >= 228 && data.avg_voltage <= 232 ? 'normal' : 'warning'
  const powerFactorStatus = data.avg_power_factor >= 0.9 ? 'good' : data.avg_power_factor >= 0.85 ? 'fair' : 'poor'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Grid Health</h3>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Last hour</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Average Voltage</p>
          <p className="text-2xl font-bold text-white mt-1">
            {parseFloat(data.avg_voltage).toFixed(1)}V
          </p>
          <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            voltageStatus === 'normal' ? 'bg-energy-green/20 text-energy-green' : 'bg-energy-orange/20 text-energy-orange'
          }`}>
            <Activity className="w-3 h-3" />
            {voltageStatus === 'normal' ? 'Normal' : 'Check Required'}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Power Factor</p>
          <p className="text-2xl font-bold text-white mt-1">
            {parseFloat(data.avg_power_factor).toFixed(3)}
          </p>
          <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            powerFactorStatus === 'good' ? 'bg-energy-green/20 text-energy-green' : 
            powerFactorStatus === 'fair' ? 'bg-energy-yellow/20 text-energy-yellow' : 
            'bg-energy-red/20 text-energy-red'
          }`}>
            {powerFactorStatus === 'good' ? 'Excellent' : powerFactorStatus === 'fair' ? 'Acceptable' : 'Poor'}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Consumption</p>
          <p className="text-2xl font-bold text-white mt-1">
            {parseFloat(data.total_consumption_kwh).toFixed(0)} kWh
          </p>
          <p className="text-slate-500 text-xs mt-1">{data.readings_last_hour} readings</p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Anomaly Rate</p>
          <p className="text-2xl font-bold text-white mt-1">
            {data.anomaly_rate}%
          </p>
          <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            data.anomaly_rate < 2 ? 'bg-energy-green/20 text-energy-green' : 
            data.anomaly_rate < 5 ? 'bg-energy-yellow/20 text-energy-yellow' : 
            'bg-energy-red/20 text-energy-red'
          }`}>
            {data.anomaly_rate < 2 ? 'Low' : data.anomaly_rate < 5 ? 'Moderate' : 'High'}
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomerSegmentsCard({ segments }) {
  if (!segments) return null

  const segmentColors = {
    'business_hours_commercial': '#3B82F6',
    'evening_residential_peak': '#EF4444',
    'night_owl_households': '#8B5CF6',
    'seasonal_variation_heavy': '#F59E0B',
    'efficiency_optimizers': '#10B981',
    'solar_battery_households': '#14B8A6',
    'ev_charging_households': '#6366F1',
    'retired_home_all_day': '#EC4899',
    'low_use_minimal': '#6B7280',
    'weekend_shift_users': '#F97316',
    'early_morning_industrial': '#0EA5E9',
    'high_consumption_all_day': '#DC2626',
  }

  const sortedSegments = Object.entries(segments)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)

  const total = Object.values(segments).reduce((a, b) => a + b, 0)

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6">Customer Segments</h3>
      
      <div className="space-y-3">
        {sortedSegments.map(([segment, count]) => {
          const percentage = (count / total * 100).toFixed(1)
          const color = segmentColors[segment] || '#6B7280'
          const label = segment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          
          return (
            <div key={segment}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-400">{count} ({percentage}%)</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null)
  const [gridHealth, setGridHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [overviewData, healthData] = await Promise.all([
        api.getOverview(),
        api.getGridHealth()
      ])
      
      setOverview(overviewData)
      setGridHealth(healthData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="w-12 h-12 text-energy-red mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Dashboard</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button onClick={loadData} className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time smart meter analytics</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-slate-500 text-sm">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button 
            onClick={loadData}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Meters"
          value={overview?.total_meters?.toLocaleString()}
          subtitle={`${overview?.active_meters} active`}
          icon={Gauge}
          color="blue"
        />
        <StatCard
          title="Readings Today"
          value={overview?.readings_today?.toLocaleString()}
          subtitle={`${overview?.total_readings?.toLocaleString()} total`}
          icon={Zap}
          color="orange"
        />
        <StatCard
          title="Active Alerts"
          value={overview?.alerts_active}
          subtitle={`${overview?.alerts_critical} critical`}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Customers"
          value={overview?.customers_total?.toLocaleString()}
          subtitle="Across 12 segments"
          icon={Users}
          color="green"
        />
      </div>

      {/* Grid Health & Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GridHealthCard data={gridHealth} />
        <CustomerSegmentsCard segments={overview?.customers_by_segment} />
      </div>
    </div>
  )
}

