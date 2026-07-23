import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTE_TITLES } from '../constants/routes'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function RoleBasedSidebar() {
  const { user } = useAuth()
  return <Sidebar user={user} />
}

function RoleBasedTopbar() {
  const { pathname } = useLocation()
  const title = ROUTE_TITLES[pathname] || 'AI Student Dashboard'
  return <Topbar title={title} />
}

export default function ProtectedLayout({ children }) {
  return (
    <div className="app-shell">
      <RoleBasedSidebar />
      <div className="main">
        <RoleBasedTopbar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}
