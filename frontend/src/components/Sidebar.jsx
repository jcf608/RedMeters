import { 
  LayoutDashboard, 
  Gauge, 
  Users, 
  AlertTriangle, 
  BarChart3,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'meters', label: 'Smart Meters', icon: Gauge },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'about', label: 'About', icon: Info },
]

export default function Sidebar({ currentPage, onNavigate }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-slate-900/80 backdrop-blur-md border-r border-slate-800 
        flex flex-col transition-all duration-300 ease-in-out
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-energy-red to-energy-orange flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-white text-lg leading-tight">
                Red Energy
              </h1>
              <p className="text-xs text-slate-400">Smart Meters</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-energy-red/20 text-energy-red' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-energy-red' : 'group-hover:text-white'
                    }`} 
                  />
                  {!isCollapsed && (
                    <span className="font-medium text-sm animate-fade-in">
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-energy-red animate-pulse" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

