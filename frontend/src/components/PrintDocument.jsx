import React from 'react'

export function genererPDF(elementId, nomFichier) {
  // Méthode fiable : utiliser window.print() 
  // Le navigateur propose automatiquement "Enregistrer en PDF"
  window.print()
}

export default function PrintDocument({ type, destinataire, lignes, totalHT, tva, aib, totalTTC, modalite, validite, remarques }) {

  const typeLabel = { facture: 'FACTURE', devis: 'DEVIS / PRO FORMA', bon_commande: 'BON DE COMMANDE' }[type]
  const prefixNumero = { facture: 'FAC', devis: 'PF', bon_commande: 'BC' }[type]
  const accentColor = { facture: '#3B82F6', devis: '#10B981', bon_commande: '#F59E0B' }[type]

  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const dateStr = `${dd}/${mm}/${yyyy}`
  const dateCode = `${yyyy}${mm}${dd}`
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  const numero = `${prefixNumero}-${dateCode}-${seq}`

  return (
    <div className="print-document" id="document-imprimable" style={{
      fontFamily: "'Arial', sans-serif",
      padding: '32px 36px',
      maxWidth: '780px',
      margin: '0 auto',
      color: '#1a1a2e',
      background: 'white',
      fontSize: '12px',
    }}>

      {/* EN-TÊTE */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '24px', paddingBottom: '20px', borderBottom: '3px solid #1B3A5C',
      }}>
        <div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#C8A96E', letterSpacing: '5px', lineHeight: 1 }}>KOUKA</div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', letterSpacing: '1px' }}>MALAK AND CO</div>
          <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>390 Avenue Pape Jean-Paul II, Cotonou</div>
          <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>Tél : 01 61 81 81 81 | koukapastry@gmail.com</div>
          <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>IFU : 3202410481922 | RCCM : RB/COT 24 B 37142</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-block', background: accentColor, color: 'white',
            fontSize: '10px', fontWeight: '700', padding: '3px 12px',
            borderRadius: '20px', letterSpacing: '1px', marginBottom: '10px',
          }}>{typeLabel}</div>
          <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.7' }}>
            <div><strong>N° :</strong> {numero}</div>
            <div><strong>Date :</strong> {dateStr}</div>
            {validite && <div><strong>Validité :</strong> {validite} jours</div>}
            <div><strong>IFU :</strong> 3202410481922</div>
          </div>
        </div>
      </div>

      {/* DESTINATAIRE */}
      <div style={{
        border: '1px solid #e2e8f0', borderLeft: `4px solid ${accentColor}`,
        borderRadius: '6px', padding: '14px 16px', marginBottom: '20px', background: '#fafbfc',
      }}>
        <div style={{ fontSize: '9px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
          {type === 'bon_commande' ? 'Fournisseur' : 'Client / Destinataire'}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B3A5C' }}>{destinataire?.nom || '—'}</div>
        {destinataire?.adresse && <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>📍 {destinataire.adresse}</div>}
        {destinataire?.tel && <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>📞 {destinataire.tel}</div>}
        {destinataire?.email && <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>✉️ {destinataire.email}</div>}
        {destinataire?.ifu && <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>IFU : {destinataire.ifu}</div>}
        {destinataire?.rccm && <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>RCCM : {destinataire.rccm}</div>}
      </div>

      {/* TABLEAU */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ background: '#1B3A5C' }}>
            <th style={{ padding: '10px 12px', color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'left', width: '80px', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Code</th>
            <th style={{ padding: '10px 12px', color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Désignation</th>
            <th style={{ padding: '10px 12px', color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'center', width: '55px', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Qté</th>
            <th style={{ padding: '10px 12px', color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'right', width: '110px', borderRight: '1px solid rgba(255,255,255,0.15)' }}>P.U (FCFA)</th>
            <th style={{ padding: '10px 12px', color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', textAlign: 'right', width: '120px' }}>Montant (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          {lignes && lignes.filter(l => l.designation).map((ligne, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f7f9fc' }}>
              <td style={{ padding: '9px 12px', fontSize: '10px', color: '#888', borderBottom: '1px solid #e8ecf0', borderRight: '1px solid #e8ecf0', fontFamily: 'monospace' }}>{ligne.code || '—'}</td>
              <td style={{ padding: '9px 12px', fontSize: '11px', borderBottom: '1px solid #e8ecf0', borderRight: '1px solid #e8ecf0' }}>{ligne.designation}</td>
              <td style={{ padding: '9px 12px', fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #e8ecf0', borderRight: '1px solid #e8ecf0' }}>{ligne.quantite}</td>
              <td style={{ padding: '9px 12px', fontSize: '11px', textAlign: 'right', borderBottom: '1px solid #e8ecf0', borderRight: '1px solid #e8ecf0' }}>{Number(ligne.prix_unitaire).toLocaleString('fr-FR')}</td>
              <td style={{ padding: '9px 12px', fontSize: '11px', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #e8ecf0' }}>{(ligne.quantite * ligne.prix_unitaire).toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAUX */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div style={{ width: '280px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#666' }}>Sous-total HT</span>
            <span>{Number(totalHT).toLocaleString('fr-FR')} FCFA</span>
          </div>
          {aib > 0 && (
            <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#666' }}>AIB (1%)</span>
              <span>{Number(aib).toLocaleString('fr-FR')} FCFA</span>
            </div>
          )}
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#666' }}>TVA (18%)</span>
            <span>{Number(tva).toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', background: '#1B3A5C', color: 'white' }}>
            <span>TOTAL TTC</span>
            <span>{Number(totalTTC).toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
      </div>

      {/* MODALITES */}
      {modalite && (
        <div style={{ border: '1px solid #e2e8f0', borderLeft: '4px solid #1B3A5C', borderRadius: '6px', padding: '12px 14px', background: '#f7f9fc', marginBottom: '14px' }}>
          <div style={{ fontSize: '9px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Modalités de paiement</div>
          {modalite.split('\n').map((line, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#555', lineHeight: '1.6' }}>• {line}</div>
          ))}
          {type === 'bon_commande' && (
            <>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.6' }}>• Le numéro du bon de commande doit être inscrit sur la facture.</div>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.6' }}>• Merci de joindre une copie du bon de commande à la facture.</div>
            </>
          )}
        </div>
      )}

      {/* REMARQUES */}
      {remarques && (
        <div style={{ border: '1px solid #fde68a', borderLeft: '4px solid #F59E0B', borderRadius: '6px', padding: '12px 14px', background: '#fffbeb', marginBottom: '14px' }}>
          <div style={{ fontSize: '9px', fontWeight: '700', color: '#B45309', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Notes / Remarques</div>
          {remarques.split('\n').map((line, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#92400e', lineHeight: '1.6' }}>• {line}</div>
          ))}
        </div>
      )}

      {/* SIGNATURE */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center', minWidth: '200px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 20px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#1B3A5C', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {type === 'bon_commande' ? 'Directrice Générale' : 'Signature & Cachet'}
          </div>
          <div style={{ height: '50px', borderBottom: '1px solid #ccc', margin: '10px 0 8px' }} />
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#1B3A5C' }}>CHAGOURY Malak</div>
          <div style={{ fontSize: '10px', color: '#888' }}>MALAK AND CO</div>
        </div>
      </div> 

      {/* PIED DE PAGE */}
      <div style={{ borderTop: '2px solid #1B3A5C', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888' }}>
        <span>koukapastry@gmail.com</span>
        <span>Tél : 01 61 81 81 81</span>
        <span style={{ fontStyle: 'italic' }}>
          {type === 'devis' ? 'Document émis à titre informatif.' : 'Merci pour votre confiance.'}
        </span>
      </div>

    </div>
  )
}