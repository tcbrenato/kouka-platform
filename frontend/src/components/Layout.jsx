import { Outlet, NavLink } from 'react-router-dom'
import { FileText, ClipboardList, ShoppingCart, Package, History } from 'lucide-react'

const navItems = [
  { to: '/facture', label: 'Facture', icon: FileText },
  { to: '/devis', label: 'Devis / Proforma', icon: ClipboardList },
  { to: '/bon-commande', label: 'Bon de Commande', icon: ShoppingCart },
  { to: '/produits', label: 'Produits', icon: Package },
  { to: '/historique', label: 'Historique', icon: History },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-navy-dark text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-yellow-400 tracking-widest">KOUKA</h1>
            <p className="text-xs text-gray-300 tracking-wider">MALAK AND CO — Gestion Documentaire</p>
          </div>
        </div>
        {/* NAV MOBILE */}
        <nav className="flex overflow-x-auto border-t border-white/10">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-3 text-xs whitespace-nowrap flex-1 transition-all
                ${isActive
                  ? 'bg-white/10 text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* CONTENU */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}