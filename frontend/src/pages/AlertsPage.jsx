import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter,
  X,
  AlertCircle,
  Info
} from 'lucide-react'
import { api } from '../services/api'

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'text-energy-red',
    bg: 'bg-energy-red/10',
    border: 'border-energy-red/30',
    badge: 'bg-energy-red/20 text-energy-red'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-energy-orange',
    bg: 'bg-energy-orange/10',
    border: 'border-energy-orange/30',
    badge: 'bg-energy-orange/20 text-energy-orange'
  },
  info: {
    icon: Info,
    color: 'text-energy-blue',
    bg: 'bg-energy-blue/10',
    border: 'border-energy-blue/30',
    badge: 'bg-energy-blue/20 text-energy-blue'
  }
}

function AlertCard({ alert, onResolve }) {
  const config = severityConfig[alert.severity] || severityConfig.info
  const Icon = config.icon
  const isResolved = !!alert.resolved_at

  // Parse description - first line is summary, rest are bullet points
  const descriptionLines = alert.description?.split('\n').filter(line => line.trim()) || []
  const summary = descriptionLines[0] || ''
  const reasons = descriptionLines.slice(1).filter(line => line.startsWith('•'))

  return (
    <div className={`card border ${isResolved ? 'border-slate-700/50 opacity-60' : config.border}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{alert.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
              {alert.severity}
            </span>
            {isResolved && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-energy-green/20 text-energy-green">
                Resolved
              </span>
            )}
          </div>
          
          {/* Summary line */}
          <p className="text-slate-300 text-sm mb-2">{summary}</p>
          
          {/* Reason bullets with explanations */}
          {reasons.length > 0 && (
            <div className="bg-slate-900/50 rounded-lg p-3 mb-3 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Why this was flagged:</p>
              {reasons.map((reason, idx) => (
                <p key={idx} className="text-sm text-slate-400">
                  {reason}
                </p>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.detected_at 
                ? new Date(alert.detected_at).toLocaleString()
                : new Date(alert.created_at).toLocaleString()
              }
            </div>
            {alert.source && (
              <span className="px-2 py-0.5 bg-slate-800 rounded">
                {alert.source.replace(/_/g, ' ')}
              </span>
            )}
            {alert.confidence && (
              <div className="flex items-center gap-1">
                <span>Confidence:</span>
                <span className={`font-medium ${
                  alert.confidence >= 90 ? 'text-energy-red' :
                  alert.confidence >= 70 ? 'text-energy-orange' :
                  'text-slate-400'
                }`}>{alert.confidence}%</span>
              </div>
            )}
          </div>
        </div>

        {!isResolved && (
          <button
            onClick={() => onResolve(alert.id)}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Resolve
          </button>
        )}
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('active') // 'active', 'all', 'critical'
  const [stats, setStats] = useState({ active: 0, total: 0 })

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filter === 'active') params.active = 'true'
      if (filter === 'critical') params.severity = 'critical'
      
      const data = await api.getAlerts(params)
      setAlerts(data.alerts)
      setStats({ active: data.active_count, total: data.total })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [filter])

  const handleResolve = async (alertId) => {
    try {
      await api.resolveAlert(alertId, 'operator')
      loadAlerts()
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Alerts</h1>
          <p className="text-slate-400 mt-1">
            {stats.active} active alerts • {stats.total} total
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => setFilter('active')}
          className={`card cursor-pointer transition-all ${
            filter === 'active' ? 'ring-2 ring-energy-orange' : 'hover:bg-slate-800/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-energy-orange/10">
              <AlertCircle className="w-5 h-5 text-energy-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-slate-400 text-sm">Active Alerts</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilter('critical')}
          className={`card cursor-pointer transition-all ${
            filter === 'critical' ? 'ring-2 ring-energy-red' : 'hover:bg-slate-800/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-energy-red/10">
              <AlertTriangle className="w-5 h-5 text-energy-red" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {alerts.filter(a => a.severity === 'critical' && !a.resolved_at).length}
              </p>
              <p className="text-slate-400 text-sm">Critical</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setFilter('all')}
          className={`card cursor-pointer transition-all ${
            filter === 'all' ? 'ring-2 ring-slate-500' : 'hover:bg-slate-800/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-700">
              <CheckCircle className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-slate-400 text-sm">All Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="w-12 h-12 text-energy-green mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-slate-400">No alerts matching your filter.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onResolve={handleResolve}
            />
          ))
        )}
      </div>
    </div>
  )
}

