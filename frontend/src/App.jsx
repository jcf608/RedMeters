import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import MetersPage from './pages/MetersPage'
import CustomersPage from './pages/CustomersPage'
import AlertsPage from './pages/AlertsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'meters':
        return <MetersPage />
      case 'customers':
        return <CustomersPage />
      case 'alerts':
        return <AlertsPage />
      case 'analytics':
        return <AnalyticsPage />
      case 'about':
        return <AboutPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 grid-pattern">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

