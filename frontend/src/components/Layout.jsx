import { Outlet, NavLink } from 'react-router-dom'
import { FileText, ClipboardList, ShoppingCart, Package, History } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Accueil', icon: FileText },
  { to: '/devis', label: 'Devis', icon: ClipboardList },
  { to: '/bon-commande', label: 'Commande', icon: ShoppingCart },
  { to: '/produits', label: 'Produits', icon: Package },
  { to: '/historique', label: 'Historique', icon: History },
]

function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff',
      borderTop: '1px solid #F3F4F6',
      display: 'flex',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={{ flex: 1, textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 4px 8px',
              gap: 3,
            }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: isActive ? '#1B3A5C' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <Icon size={18} color={isActive ? '#C8A96E' : '#9CA3AF'} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 400,
                color: isActive ? '#1B3A5C' : '#9CA3AF',
                letterSpacing: 0.3,
              }}>
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FC', fontFamily: "'Georgia', serif" }}>
      {/* HEADER */}
      <header style={{
        background: '#1B3A5C',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}>
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ margin: 0, color: '#C8A96E', fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
            KOUKA<span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 400 }}>'s</span>
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 1 }}>
            MALAK AND CO
          </p>
        </NavLink>
      </header>

      {/* CONTENU */}
      <main style={{ paddingBottom: 80, minHeight: 'calc(100vh - 60px)' }}>
        <Outlet />
      </main>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  )
}