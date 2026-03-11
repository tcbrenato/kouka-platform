import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FileText, ClipboardList, ShoppingCart, Package, History, ChevronRight, Sparkles } from 'lucide-react'

const docChoices = [
  {
    to: '/facture',
    label: 'Facture',
    desc: 'Facturer un client',
    icon: FileText,
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    to: '/devis',
    label: 'Devis / Proforma',
    desc: 'Établir un devis ou proforma',
    icon: ClipboardList,
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    to: '/bon-commande',
    label: 'Bon de Commande',
    desc: 'Passer une commande fournisseur',
    icon: ShoppingCart,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
]

const navItems = [
  { to: '/facture', label: 'Facture', icon: FileText },
  { to: '/devis', label: 'Devis', icon: ClipboardList },
  { to: '/bon-commande', label: 'Commande', icon: ShoppingCart },
  { to: '/produits', label: 'Produits', icon: Package },
  { to: '/historique', label: 'Historique', icon: History },
]

function WelcomeScreen() {
  const navigate = useNavigate()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F9FC',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Georgia', serif",
    }}>
      {/* TOP HEADER */}
      <div style={{
        background: '#1B3A5C',
        padding: '28px 24px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160,
          borderRadius: '50%',
          background: 'rgba(200,169,110,0.12)',
        }} />
        <div style={{
          position: 'absolute', top: 10, right: 20,
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'rgba(200,169,110,0.08)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C8A96E', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
            {greeting} 👋
          </p>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, letterSpacing: 2, margin: 0 }}>
            KOUKA<span style={{ color: '#C8A96E', fontSize: 18, fontWeight: 400 }}>'s</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
            {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
          </p>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div style={{ padding: '28px 20px 0' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '20px 20px 8px',
          boxShadow: '0 2px 16px rgba(27,58,92,0.07)',
          borderLeft: '4px solid #C8A96E',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Sparkles size={16} color="#C8A96E" />
            <p style={{ color: '#1B3A5C', fontSize: 13, fontWeight: 700, letterSpacing: 0.5, margin: 0 }}>
              Quel document souhaitez-vous établir aujourd'hui ?
            </p>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 16px' }}>
            Sélectionnez un type de document ci-dessous
          </p>

          {/* CHOICES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
            {docChoices.map(({ to, label, desc, icon: Icon, color, bg, border }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${color}40`,
                }}>
                  <Icon size={20} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1B3A5C' }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#6B7280', marginTop: 2 }}>{desc}</p>
                </div>
                <ChevronRight size={18} color={color} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={{ padding: '24px 20px 100px' }}>
        <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          Accès rapide
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/produits')}
            style={{
              flex: 1, background: '#fff', border: '1.5px solid #E5E7EB',
              borderRadius: 14, padding: '14px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}
          >
            <Package size={22} color="#6B7280" />
            <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Produits</span>
          </button>
          <button
            onClick={() => navigate('/historique')}
            style={{
              flex: 1, background: '#fff', border: '1.5px solid #E5E7EB',
              borderRadius: 14, padding: '14px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              cursor: 'pointer',
            }}
          >
            <History size={22} color="#6B7280" />
            <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Historique</span>
          </button>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  )
}

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
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === '/facture' && !sessionStorage.getItem('visited')

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FC', fontFamily: "'Georgia', serif" }}>
      {/* HEADER (pages internes) */}
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