import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { StepNav } from '@/components/StepNav'

export default function RootLayout() {
  const { pathname } = useLocation()
  const match = pathname.match(/^\/step\/(\d+)/)
  const currentStep = match ? parseInt(match[1]) : 1
  const isSidebarMode = currentStep >= 3

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-wordmark">Patchwork</NavLink>
      </header>

      {!isSidebarMode && (
        <div className="app-progress-strip">
          <StepNav variant="progress" currentStep={currentStep} />
        </div>
      )}

      {isSidebarMode ? (
        <div className="app-body--sidebar">
          <aside className="app-sidebar">
            <StepNav variant="sidebar" currentStep={currentStep} />
          </aside>
          <main className="app-main">
            <Outlet />
          </main>
        </div>
      ) : (
        <div className="app-body--centered">
          <main className="app-main--centered">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  )
}
