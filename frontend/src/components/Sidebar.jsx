import { 
  LayoutDashboard, 
  Gauge, 
  Users, 
  AlertTriangle, 
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react'
import { useState } from 'react'
import HelpModal from './HelpModal'

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
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
    <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    <aside 
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-white border-r border-[#e8e8ed]
        flex flex-col transition-all duration-300 ease-in-out
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#e8e8ed]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff3b30] to-[#ff9500] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-semibold text-[#1d1d1f] text-base leading-tight tracking-tight">
                Red Energy
              </h1>
              <p className="text-xs text-[#86868b]">Smart Meters</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-500/25' 
                      : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#86868b] group-hover:text-[#1d1d1f]'
                    }`} 
                  />
                  {!isCollapsed && (
                    <span className={`font-medium text-sm animate-fade-in ${isActive ? '' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#e8e8ed] space-y-2">
        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#86868b] hover:text-[#0071e3] hover:bg-[#0071e3]/5 rounded-xl transition-colors"
          title="Help & Overview"
        >
          <HelpCircle className="w-5 h-5" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Help</span>
          )}
        </button>
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  )
}
