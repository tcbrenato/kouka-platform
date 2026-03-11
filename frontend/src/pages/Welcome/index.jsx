import { useNavigate } from 'react-router-dom'
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

export default function Welcome() {
  const navigate = useNavigate()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ padding: '24px 20px 0', background: '#F8F9FC', minHeight: '100%' }}>

      {/* SALUTATION */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 2px' }}>
          {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
        </p>
        <h2 style={{ color: '#1B3A5C', fontSize: 22, fontWeight: 700, margin: 0 }}>
          {greeting} ! 👋
        </h2>
      </div>

      {/* QUESTION CARD */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '20px',
        boxShadow: '0 2px 16px rgba(27,58,92,0.07)',
        borderLeft: '4px solid #C8A96E',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Sparkles size={16} color="#C8A96E" />
          <p style={{ color: '#1B3A5C', fontSize: 14, fontWeight: 700, margin: 0 }}>
            Quel document souhaitez-vous établir aujourd'hui ?
          </p>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 16px' }}>
          Sélectionnez un type de document
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                width: '100%',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{
                width: 46, height: 46,
                borderRadius: 12,
                background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${color}40`,
              }}>
                <Icon size={22} color="#fff" />
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

      {/* ACCÈS RAPIDE */}
      <p style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
        Accès rapide
      </p>
      <div style={{ display: 'flex', gap: 12, paddingBottom: 20 }}>
        <button
          onClick={() => navigate('/produits')}
          style={{
            flex: 1, background: '#fff', border: '1.5px solid #E5E7EB',
            borderRadius: 14, padding: '16px 12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}
        >
          <Package size={24} color="#6B7280" />
          <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Produits</span>
        </button>
        <button
          onClick={() => navigate('/historique')}
          style={{
            flex: 1, background: '#fff', border: '1.5px solid #E5E7EB',
            borderRadius: 14, padding: '16px 12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}
        >
          <History size={24} color="#6B7280" />
          <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Historique</span>
        </button>
      </div>
    </div>
  )
}