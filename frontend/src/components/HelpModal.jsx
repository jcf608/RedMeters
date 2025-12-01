import { 
  X, 
  Gauge, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Zap,
  Activity,
  TrendingUp,
  Shield,
  Database,
  Brain,
  Clock
} from 'lucide-react'

const features = [
  {
    icon: Gauge,
    title: 'Smart Meter Monitoring',
    description: 'Real-time monitoring of all connected smart meters with live voltage, power factor, and consumption data.',
    color: '#0071e3'
  },
  {
    icon: Activity,
    title: 'Grid Health Analytics',
    description: 'Comprehensive grid health metrics including voltage stability, power factor analysis, and consumption patterns.',
    color: '#34c759'
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    description: 'AI-powered anomaly detection identifies unusual patterns in meter readings, voltage spikes, and consumption irregularities.',
    color: '#ff3b30'
  },
  {
    icon: Users,
    title: 'Customer Segmentation',
    description: '12 distinct customer segments based on usage patterns: residential, commercial, EV charging, solar battery, and more.',
    color: '#af52de'
  },
  {
    icon: TrendingUp,
    title: 'Demand Forecasting',
    description: 'Machine learning models predict future energy demand to optimize grid capacity and resource allocation.',
    color: '#ff9500'
  },
  {
    icon: Brain,
    title: 'Predictive Maintenance',
    description: 'Predicts meter failures before they occur, enabling proactive maintenance and reducing downtime.',
    color: '#5856d6'
  }
]

const techStack = [
  { label: 'Backend', value: 'Ruby + Sinatra + ActiveRecord' },
  { label: 'Frontend', value: 'React 19 + Vite + Tailwind CSS' },
  { label: 'Database', value: 'PostgreSQL with time-series optimization' },
  { label: 'ML Models', value: 'Python scikit-learn + Prophet' },
]

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#ff3b30] to-[#ff9500] px-8 py-10 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Red Energy Smart Meters</h2>
              <p className="text-white/80 text-sm">Intelligent Energy Management Platform</p>
            </div>
          </div>
          
          <p className="text-white/90 text-base leading-relaxed max-w-2xl">
            A comprehensive smart meter analytics platform providing real-time monitoring, 
            AI-powered anomaly detection, and predictive insights for energy grid management.
          </p>
        </div>
        
        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Features Grid */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0071e3]" />
              Platform Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={feature.title}
                    className="p-5 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${feature.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1d1d1f] mb-1">{feature.title}</h4>
                        <p className="text-sm text-[#86868b] leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-5 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#34c759]" />
              Technology Stack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {techStack.map((tech) => (
                <div 
                  key={tech.label}
                  className="p-4 rounded-xl bg-[#f5f5f7] text-center"
                >
                  <p className="text-xs text-[#86868b] uppercase tracking-wide mb-1">{tech.label}</p>
                  <p className="text-sm font-medium text-[#1d1d1f]">{tech.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ff9500]" />
              Real-Time Capabilities
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-sm font-medium">
                30-second refresh rate
              </span>
              <span className="px-4 py-2 rounded-full bg-[#34c759]/10 text-[#248a3d] text-sm font-medium">
                Live anomaly alerts
              </span>
              <span className="px-4 py-2 rounded-full bg-[#ff9500]/10 text-[#b25000] text-sm font-medium">
                12 customer segments
              </span>
              <span className="px-4 py-2 rounded-full bg-[#af52de]/10 text-[#8944ab] text-sm font-medium">
                4 ML models
              </span>
              <span className="px-4 py-2 rounded-full bg-[#ff3b30]/10 text-[#d70015] text-sm font-medium">
                Multi-factor detection
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-5 bg-[#f5f5f7] border-t border-[#e8e8ed] flex items-center justify-between">
          <p className="text-sm text-[#86868b]">
            Red Energy © {new Date().getFullYear()} • Smart Meter Analytics
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0071e3] text-white rounded-xl text-sm font-medium hover:bg-[#0077ed] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

