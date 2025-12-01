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
  ChevronRight,
  Circle
} from 'lucide-react'
import { api } from '../services/api'

function MetricCard({ title, value, subtitle, icon: Icon, trend, accentColor = '#0071e3', delay = 0 }) {
  return (
    <div className={`apple-stat-card animate-slide-up delay-${delay}`}>
      <div className="flex items-center justify-between mb-6">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `${accentColor}10` }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: trend >= 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)' }}>
            {trend >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" style={{ color: '#34c759' }} />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" style={{ color: '#ff3b30' }} />
            )}
            <span className="text-xs font-semibold" style={{ color: trend >= 0 ? '#34c759' : '#ff3b30' }}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="metric-value mb-2">
        {value ?? '—'}
      </div>
      
      <p className="text-[#1d1d1f] text-base font-medium tracking-tight">{title}</p>
      
      {subtitle && (
        <p className="text-[#86868b] text-sm mt-1">{subtitle}</p>
      )}
    </div>
  )
}

function GridHealthPanel({ data }) {
  if (!data) return null

  const voltageStatus = data.avg_voltage >= 228 && data.avg_voltage <= 232 ? 'normal' : 'warning'
  const powerFactorStatus = data.avg_power_factor >= 0.9 ? 'good' : data.avg_power_factor >= 0.85 ? 'fair' : 'poor'

  const metrics = [
    {
      label: 'Average Voltage',
      value: `${parseFloat(data.avg_voltage).toFixed(1)}V`,
      status: voltageStatus === 'normal' ? 'Normal Range' : 'Check Required',
      statusType: voltageStatus === 'normal' ? 'green' : 'orange',
    },
    {
      label: 'Power Factor',
      value: parseFloat(data.avg_power_factor).toFixed(3),
      status: powerFactorStatus === 'good' ? 'Excellent' : powerFactorStatus === 'fair' ? 'Acceptable' : 'Needs Attention',
      statusType: powerFactorStatus === 'good' ? 'green' : powerFactorStatus === 'fair' ? 'orange' : 'red',
    },
    {
      label: 'Total Consumption',
      value: `${parseFloat(data.total_consumption_kwh).toFixed(0)} kWh`,
      status: `${data.readings_last_hour} readings`,
      statusType: 'blue',
    },
    {
      label: 'Anomaly Rate',
      value: `${data.anomaly_rate}%`,
      status: data.anomaly_rate < 2 ? 'Low' : data.anomaly_rate < 5 ? 'Moderate' : 'High',
      statusType: data.anomaly_rate < 2 ? 'green' : data.anomaly_rate < 5 ? 'orange' : 'red',
    },
  ]

  const statusColors = {
    green: { bg: 'rgba(52, 199, 89, 0.1)', text: '#248a3d' },
    orange: { bg: 'rgba(255, 149, 0, 0.1)', text: '#b25000' },
    red: { bg: 'rgba(255, 59, 48, 0.1)', text: '#d70015' },
    blue: { bg: 'rgba(0, 113, 227, 0.1)', text: '#0071e3' },
  }

  return (
    <div className="apple-card-elevated animate-slide-up delay-5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">Grid Health</h3>
          <p className="text-[#86868b] text-sm mt-1">Last hour performance</p>
        </div>
        <button className="flex items-center gap-1 text-[#0071e3] text-sm font-medium hover:underline transition-all">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.label}
            className="rounded-2xl p-5 transition-all duration-300 hover:shadow-md"
            style={{ background: '#f5f5f7' }}
          >
            <p className="text-[#86868b] text-xs font-medium uppercase tracking-wide mb-3">{metric.label}</p>
            <p className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              {metric.value}
            </p>
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ 
                background: statusColors[metric.statusType].bg,
                color: statusColors[metric.statusType].text 
              }}
            >
              <Circle className="w-1.5 h-1.5 fill-current" />
              {metric.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomerSegmentsPanel({ segments }) {
  if (!segments) return null

  const segmentConfig = {
    'business_hours_commercial': { color: '#0071e3', label: 'Commercial Business' },
    'evening_residential_peak': { color: '#ff3b30', label: 'Evening Peak Residential' },
    'night_owl_households': { color: '#af52de', label: 'Night Owl Households' },
    'seasonal_variation_heavy': { color: '#ff9500', label: 'Seasonal Heavy' },
    'efficiency_optimizers': { color: '#34c759', label: 'Efficiency Optimizers' },
    'solar_battery_households': { color: '#30d158', label: 'Solar & Battery' },
    'ev_charging_households': { color: '#5856d6', label: 'EV Charging' },
    'retired_home_all_day': { color: '#ff2d55', label: 'All-Day Home' },
    'low_use_minimal': { color: '#8e8e93', label: 'Minimal Use' },
    'weekend_shift_users': { color: '#ff9f0a', label: 'Weekend Shift' },
    'early_morning_industrial': { color: '#64d2ff', label: 'Early Industrial' },
    'high_consumption_all_day': { color: '#ff453a', label: 'High Consumption' },
  }

  const sortedSegments = Object.entries(segments)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const total = Object.values(segments).reduce((a, b) => a + b, 0)
  const maxCount = Math.max(...sortedSegments.map(([, count]) => count))

  return (
    <div className="apple-card-elevated animate-slide-up delay-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">Customer Segments</h3>
          <p className="text-[#86868b] text-sm mt-1">{total.toLocaleString()} total customers</p>
        </div>
        <button className="flex items-center gap-1 text-[#0071e3] text-sm font-medium hover:underline transition-all">
          Explore
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-5">
        {sortedSegments.map(([segment, count]) => {
          const config = segmentConfig[segment] || { color: '#8e8e93', label: segment }
          const percentage = (count / total * 100).toFixed(1)
          const barWidth = (count / maxCount * 100)
          
          return (
            <div key={segment}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ background: config.color }}
                  />
                  <span className="text-[#1d1d1f] text-sm font-medium">{config.label}</span>
                </div>
                <span className="text-[#86868b] text-sm tabular-nums font-medium">
                  {count.toLocaleString()} <span className="text-[#a1a1a6]">({percentage}%)</span>
                </span>
              </div>
              <div className="apple-progress">
                <div 
                  className="apple-progress-fill"
                  style={{ 
                    width: `${barWidth}%`,
                    background: config.color
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
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="apple-card-elevated text-center max-w-md animate-scale-in p-10">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-[#ff3b30]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Unable to Load Dashboard</h2>
          <p className="text-[#86868b] mb-8">{error}</p>
          <button onClick={loadData} className="btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="apple-bg min-h-full -m-8 p-8 lg:p-12">
      {/* Hero Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5f5f7] mb-6">
            <Activity className="w-4 h-4 text-[#0071e3]" />
            <span className="text-[#0071e3] text-sm font-medium">Live Monitoring</span>
          </div>
          <h1 className="headline-large mb-4">
            Smart Meter Dashboard
          </h1>
          <p className="body-large max-w-2xl mx-auto">
            Real-time analytics and insights across your entire energy network.
          </p>
        </div>

        {/* Refresh bar */}
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <div>
            {lastUpdated && (
              <p className="text-[#86868b] text-sm">
                Last updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <MetricCard
            title="Total Meters"
            value={overview?.total_meters?.toLocaleString()}
            subtitle={`${overview?.active_meters} currently active`}
            icon={Gauge}
            accentColor="#0071e3"
            delay={1}
          />
          <MetricCard
            title="Readings Today"
            value={overview?.readings_today?.toLocaleString()}
            subtitle={`${overview?.total_readings?.toLocaleString()} total readings`}
            icon={Zap}
            accentColor="#ff9500"
            delay={2}
          />
          <MetricCard
            title="Active Alerts"
            value={overview?.alerts_active}
            subtitle={`${overview?.alerts_critical} require attention`}
            icon={AlertTriangle}
            accentColor="#ff3b30"
            delay={3}
          />
          <MetricCard
            title="Customers"
            value={overview?.customers_total?.toLocaleString()}
            subtitle="Across 12 segments"
            icon={Users}
            accentColor="#34c759"
            delay={4}
          />
        </div>

        {/* Detail Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GridHealthPanel data={gridHealth} />
          <CustomerSegmentsPanel segments={overview?.customers_by_segment} />
        </div>
      </div>
    </div>
  )
}
