import React from 'react'

export function genererPDF(elementId, nomFichier) {
  const element = document.getElementById(elementId)
  if (!element) return
  const html2pdf = window.html2pdf
  html2pdf().set({
    margin: 10,
    filename: nomFichier,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save()
}

export default function PrintDocument({ type, destinataire, lignes, totalHT, tva, aib, totalTTC, modalite, validite }) {

  const typeLabel = { facture: 'FACTURE', devis: 'DEVIS / PRO FORMA', bon_commande: 'BON DE COMMANDE' }[type]
  const prefixNumero = { facture: 'FAC', devis: 'PF', bon_commande: 'BC' }[type]

  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const dateStr = `${dd}/${mm}/${yyyy}`
  const dateCode = `${yyyy}${mm}${dd}`
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  const numero = `${prefixNumero}-${dateCode}-${seq}`

  return (
    <div className="print-document" id="document-imprimable" style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#1B3A5C', background: 'white' }}>

      {/* EN-TETE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#C8A96E', letterSpacing: '4px' }}>KOUKA</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>MALAK AND CO</div>
          <div style={{ fontSize: '10px', color: '#777' }}>390 Avenue Pape Jean-Paul II, Cotonou</div>
          <div style={{ fontSize: '10px', color: '#777' }}>Tél : 01 61 81 81 81</div>
          <div style={{ fontSize: '10px', color: '#777' }}>koukapastry@gmail.com</div>
          <div style={{ fontSize: '10px', color: '#777' }}>IFU : 3202410481922</div>
          <div style={{ fontSize: '10px', color: '#777' }}>RCCM : RB/COT 24 B 37142</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1B3A5C' }}>{typeLabel}</div>
          <div style={{ fontSize: '11px', color: '#777', marginTop: '8px' }}>Numéro : {numero}</div>
          <div style={{ fontSize: '11px', color: '#777' }}>Date : {dateStr}</div>
          {validite && <div style={{ fontSize: '11px', color: '#777' }}>Validité : {validite} jours</div>}
          <div style={{ fontSize: '11px', color: '#777' }}>IFU : 3202410481922</div>
        </div>
      </div>

      {/* LIGNE BLEUE */}
      <div style={{ height: '3px', background: '#1B3A5C', marginBottom: '24px', borderRadius: '2px' }} />

      {/* DESTINATAIRE */}
      <div style={{ marginBottom: '24px', padding: '14px 16px', border: '1px solid #dce3ee', borderRadius: '8px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          {type === 'bon_commande' ? 'Fournisseur' : 'Client / Payable à'}
        </div>
        <div style={{ fontSize: '13px', fontWeight: '600' }}>{destinataire?.nom || '—'}</div>
        {destinataire?.adresse && <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{destinataire.adresse}</div>}
        {destinataire?.tel && <div style={{ fontSize: '11px', color: '#666' }}>Tél : {destinataire.tel}</div>}
        {destinataire?.email && <div style={{ fontSize: '11px', color: '#666' }}>Email : {destinataire.email}</div>}
        {destinataire?.ifu && <div style={{ fontSize: '11px', color: '#666' }}>IFU : {destinataire.ifu}</div>}
        {destinataire?.rccm && <div style={{ fontSize: '11px', color: '#666' }}>RCCM : {destinataire.rccm}</div>}
      </div>

      {/* TABLEAU */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ background: '#1B3A5C', color: 'white' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', width: '90px' }}>CODE</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px' }}>DÉSIGNATION</th>
            <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', width: '60px' }}>QTÉ</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', width: '110px' }}>P.U (FCFA)</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', width: '120px' }}>MONTANT (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          {lignes && lignes.filter(l => l.designation).map((ligne, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f4f6f9' }}>
              <td style={{ padding: '9px 12px', fontSize: '11px', color: '#888', borderBottom: '1px solid #eee', fontFamily: 'monospace' }}>{ligne.code || '—'}</td>
              <td style={{ padding: '9px 12px', fontSize: '12px', borderBottom: '1px solid #eee' }}>{ligne.designation}</td>
              <td style={{ padding: '9px 12px', fontSize: '12px', textAlign: 'center', borderBottom: '1px solid #eee' }}>{ligne.quantite}</td>
              <td style={{ padding: '9px 12px', fontSize: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{Number(ligne.prix_unitaire).toLocaleString('fr-FR')}</td>
              <td style={{ padding: '9px 12px', fontSize: '12px', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #eee' }}>{(ligne.quantite * ligne.prix_unitaire).toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAUX */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <div style={{ width: '280px', border: '1px solid #dce3ee', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#777' }}>Sous-total HT</span>
            <span>{Number(totalHT).toLocaleString('fr-FR')} FCFA</span>
          </div>
          {aib > 0 && (
            <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid #eee' }}>
              <span style={{ color: '#777' }}>AIB (1%)</span>
              <span>{Number(aib).toLocaleString('fr-FR')} FCFA</span>
            </div>
          )}
          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid #eee' }}>
            <span style={{ color: '#777' }}>TVA (18%)</span>
            <span>{Number(tva).toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', background: '#1B3A5C', color: 'white' }}>
            <span>TOTAL TTC</span>
            <span>{Number(totalTTC).toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
      </div>

      {/* MODALITES */}
      {modalite && (
        <div style={{ marginBottom: '24px', padding: '12px 16px', background: '#f4f6f9', borderRadius: '8px', borderLeft: '3px solid #1B3A5C' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#1B3A5C' }}>
            Modalités de paiement
          </div>
          {modalite.split('\n').map((line, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>• {line}</div>
          ))}
          {type === 'bon_commande' && (
            <>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>• Le numéro du bon de commande doit être inscrit sur la facture.</div>
              <div style={{ fontSize: '11px', color: '#666' }}>• Merci de joindre une copie du bon de commande à la facture.</div>
            </>
          )}
        </div>
      )}

      {/* SIGNATURE */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', minWidth: '200px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#1B3A5C', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {type === 'bon_commande' ? 'Directrice Générale' : 'Signature & Cachet'}
          </div>
          <div style={{ height: '60px', borderBottom: '1px solid #ccc', marginTop: '8px', marginBottom: '8px' }} />
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1B3A5C' }}>CHAGOURY Malak</div>
          <div style={{ fontSize: '10px', color: '#888' }}>MALAK AND CO</div>
        </div>
      </div>

      {/* PIED DE PAGE */}
      <div style={{ borderTop: '2px solid #1B3A5C', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999' }}>
        <span>koukapastry@gmail.com</span>
        <span>Tél : 01 61 81 81 81</span>
        <span style={{ fontStyle: 'italic' }}>
          {type === 'devis' ? 'Document émis à titre informatif.' : 'Merci pour votre confiance.'}
        </span>
      </div>

    </div>
  )
}