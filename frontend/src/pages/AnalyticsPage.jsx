import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  Zap,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { api } from '../services/api'

function TransformerCard({ data }) {
  if (!data) return null

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-energy-orange" />
        Transformer Fleet
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Transformers</p>
          <p className="text-3xl font-bold text-white mt-1">{data.total}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Operational</p>
          <p className="text-3xl font-bold text-energy-green mt-1">{data.operational}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">High Risk</p>
          <p className="text-3xl font-bold text-energy-red mt-1">{data.high_risk}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Aging (&gt;20 yrs)</p>
          <p className="text-3xl font-bold text-energy-orange mt-1">{data.aging}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Average Failure Risk</span>
          <span className="text-white font-medium">
            {(parseFloat(data.avg_failure_risk) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              parseFloat(data.avg_failure_risk) < 0.3 ? 'bg-energy-green' :
              parseFloat(data.avg_failure_risk) < 0.6 ? 'bg-energy-yellow' : 'bg-energy-red'
            }`}
            style={{ width: `${parseFloat(data.avg_failure_risk) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm mt-4">
          <span className="text-slate-400">Average Age</span>
          <span className="text-white font-medium">{parseFloat(data.avg_age_years).toFixed(1)} years</span>
        </div>
      </div>
    </div>
  )
}

function SegmentAnalyticsCard({ segments }) {
  if (!segments?.segments) return null

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-energy-blue" />
        Customer Segment Analysis
      </h3>

      <div className="space-y-4">
        {segments.segments.slice(0, 8).map((seg) => (
          <div key={seg.segment} className="group">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-300 capitalize group-hover:text-white transition-colors">
                {seg.segment_name || seg.segment?.replace(/_/g, ' ')}
              </span>
              <span className="text-slate-400">
                {seg.count} ({seg.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-energy-blue to-energy-green rounded-full transition-all duration-500 group-hover:opacity-80"
                style={{ width: `${seg.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Total Customers</span>
          <span className="text-white font-semibold">{segments.total_customers}</span>
        </div>
      </div>
    </div>
  )
}

function GridMetricsCard({ health }) {
  if (!health) return null

  const metrics = [
    {
      label: 'Voltage Range',
      value: `${parseFloat(health.voltage_range?.min).toFixed(0)}V - ${parseFloat(health.voltage_range?.max).toFixed(0)}V`,
      status: parseFloat(health.voltage_range?.min) >= 216 && parseFloat(health.voltage_range?.max) <= 253 ? 'good' : 'warning'
    },
    {
      label: 'Power Factor',
      value: parseFloat(health.avg_power_factor).toFixed(3),
      status: parseFloat(health.avg_power_factor) >= 0.9 ? 'good' : parseFloat(health.avg_power_factor) >= 0.85 ? 'warning' : 'poor'
    },
    {
      label: 'Hourly Consumption',
      value: `${parseFloat(health.total_consumption_kwh).toFixed(0)} kWh`,
      status: 'neutral'
    },
    {
      label: 'Hourly Demand',
      value: `${parseFloat(health.total_demand_kw).toFixed(0)} kW`,
      status: 'neutral'
    },
    {
      label: 'Readings (Last Hour)',
      value: health.readings_last_hour.toLocaleString(),
      status: 'neutral'
    },
    {
      label: 'Anomaly Rate',
      value: `${health.anomaly_rate}%`,
      status: health.anomaly_rate < 2 ? 'good' : health.anomaly_rate < 5 ? 'warning' : 'poor'
    }
  ]

  const statusColors = {
    good: 'text-energy-green',
    warning: 'text-energy-yellow',
    poor: 'text-energy-red',
    neutral: 'text-white'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-energy-green" />
        Live Grid Metrics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">{metric.label}</p>
            <p className={`text-xl font-bold mt-1 ${statusColors[metric.status]}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [gridHealth, setGridHealth] = useState(null)
  const [transformers, setTransformers] = useState(null)
  const [segments, setSegments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [health, trans, segs] = await Promise.all([
        api.getGridHealth(),
        api.getTransformerStats(),
        api.getCustomerSegments()
      ])
      
      setGridHealth(health)
      setTransformers(trans)
      setSegments(segs)
    } catch (err) {
      console.error('Failed to load analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Refresh every minute
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="w-12 h-12 text-energy-red mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Analytics</h2>
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
          <h1 className="text-3xl font-display font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Deep dive into grid performance and customer insights</p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GridMetricsCard health={gridHealth} />
        <TransformerCard data={transformers} />
        <SegmentAnalyticsCard segments={segments} />
        
        {/* Placeholder for future charts */}
        <div className="card flex flex-col items-center justify-center py-12">
          <TrendingUp className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">Demand Forecasting</h3>
          <p className="text-slate-500 text-sm text-center">
            Coming soon: 72-hour demand predictions<br />powered by Prophet ML model
          </p>
        </div>
      </div>
    </div>
  )
}

