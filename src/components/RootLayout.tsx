import { Outlet, NavLink } from 'react-router-dom'

const steps = [
  { path: '/step/1', label: 'Dimensions' },
  { path: '/step/2', label: 'Square Size' },
  { path: '/step/3', label: 'Quilt Builder' },
  { path: '/step/4', label: 'Add Color' },
  { path: '/step/5', label: 'Calculation' },
  { path: '/step/6', label: 'Export' },
]

export default function RootLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-wordmark">Patchwork</NavLink>
        <nav className="step-nav-bar">
          {steps.map((step, i) => (
            <NavLink
              key={step.path}
              to={step.path}
              className={({ isActive }) =>
                ['step-nav-item', isActive ? 'step-nav-item--active' : ''].join(' ').trim()
              }
            >
              <span className="step-nav-dot">{i + 1}</span>
              <span className="step-nav-label">{step.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
