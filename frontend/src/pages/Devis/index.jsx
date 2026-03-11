import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, ClipboardList, Printer, Download } from 'lucide-react'
import PrintDocument, { genererPDF } from '../../components/PrintDocument'

const TVA_RATE = 0.18

export default function Devis() {
  const [produits, setProduits] = useState([])
  const [client, setClient] = useState({ nom: '', adresse: '', tel: '', email: '' })
  const [lignes, setLignes] = useState([{ designation: '', quantite: 1, prix_unitaire: 0 }])
  const [validite, setValidite] = useState('15')
  const [modalite, setModalite] = useState('70% à la commande\n30% à la livraison')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { fetchProduits() }, [])

  async function fetchProduits() {
    const { data } = await supabase.from('produits').select('*').order('designation')
    if (data) setProduits(data)
  }

  function ajouterLigne() {
    setLignes([...lignes, { designation: '', quantite: 1, prix_unitaire: 0 }])
  }

  function supprimerLigne(i) {
    setLignes(lignes.filter((_, idx) => idx !== i))
  }

  function updateLigne(i, field, value) {
    const updated = [...lignes]
    updated[i][field] = value
    setLignes(updated)
  }

  function selectProduit(i, produitId) {
    const p = produits.find(p => p.id === produitId)
    if (!p) return
    const updated = [...lignes]
    updated[i].designation = p.designation
    updated[i].prix_unitaire = p.prix_unitaire
    updated[i].code = p.code
    setLignes(updated)
  }

  const totalHT = lignes.reduce((sum, l) => sum + (l.quantite * l.prix_unitaire), 0)
  const tva = totalHT * TVA_RATE
  const totalTTC = totalHT + tva

  async function sauvegarder() {
    if (!client.nom) {
      setMessage('⚠️ Nom du client obligatoire')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    setSaving(true)
    const d = new Date()
    const numero = `PF-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`
    const { error } = await supabase.from('documents').insert([{
      type: 'devis', numero,
      client_nom: client.nom, client_adresse: client.adresse,
      client_tel: client.tel, client_email: client.email,
      lignes, total_ht: totalHT, tva, total_ttc: totalTTC
    }])
    if (!error) { setMessage('✅ Devis sauvegardé !'); setTimeout(() => setMessage(''), 3000) }
    setSaving(false)
  }

  function telechargerPDF() {
  window.print()
}

  return (
    <div className="space-y-6 pb-10">

      <div className="no-print space-y-6">

        {/* TITRE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-navy-dark">Devis / Proforma</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={telechargerPDF} className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm hover:bg-green-600 hover:text-white transition">
              <Download size={15} /> PDF
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 border border-navy-dark text-navy-dark px-4 py-2 rounded-lg text-sm hover:bg-navy-dark hover:text-white transition">
              <Printer size={15} /> Imprimer
            </button>
            <button onClick={sauvegarder} disabled={saving} className="flex items-center gap-2 bg-navy-dark text-white px-4 py-2 rounded-lg text-sm hover:bg-navy-light transition disabled:opacity-50">
              {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`text-sm font-medium px-4 py-2 rounded-lg ${message.includes('⚠️') ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        {/* INFOS CLIENT */}
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
          <h3 className="font-semibold text-navy-dark text-sm uppercase tracking-wide">Informations Client</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nom / Raison sociale *</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: STE LA ROCHE S.A.R.L" value={client.nom} onChange={e => setClient({ ...client, nom: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Téléphone</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: +229 01 XX XX XX XX" value={client.tel} onChange={e => setClient({ ...client, tel: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: 01 B.P 2525 Cotonou" value={client.adresse} onChange={e => setClient({ ...client, adresse: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: client@email.com" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} />
            </div>
          </div>
        </div>

        {/* CONDITIONS */}
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
          <h3 className="font-semibold text-navy-dark text-sm uppercase tracking-wide">Conditions du Devis</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Validité (jours)</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={validite} onChange={e => setValidite(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Modalités de paiement</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" rows={2} value={modalite} onChange={e => setModalite(e.target.value)} />
            </div>
          </div>
        </div>

        {/* LIGNES PRODUITS */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-navy-dark text-white px-4 py-3">
            <span className="text-sm font-semibold">Désignation des produits / services</span>
          </div>
          <div className="p-4 space-y-3">
            {lignes.map((ligne, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 sm:col-span-5">
                  {i === 0 && <label className="text-xs text-gray-500 mb-1 block">Désignation</label>}
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value="" onChange={e => selectProduit(i, e.target.value)}>
                    <option value="">-- Choisir du catalogue --</option>
                    {produits.map(p => <option key={p.id} value={p.id}>{p.designation}</option>)}
                  </select>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1" placeholder="Ou saisir manuellement" value={ligne.designation} onChange={e => updateLigne(i, 'designation', e.target.value)} />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  {i === 0 && <label className="text-xs text-gray-500 mb-1 block">Qté</label>}
                  <input type="number" min="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={ligne.quantite} onChange={e => updateLigne(i, 'quantite', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  {i === 0 && <label className="text-xs text-gray-500 mb-1 block">Prix unitaire</label>}
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={ligne.prix_unitaire} onChange={e => updateLigne(i, 'prix_unitaire', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  {i === 0 && <label className="text-xs text-gray-500 mb-1 block">Montant</label>}
                  <div className="border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm font-semibold text-right">
                    {(ligne.quantite * ligne.prix_unitaire).toLocaleString('fr-FR')}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  {lignes.length > 1 && <button onClick={() => supprimerLigne(i)} className="text-red-300 hover:text-red-500"><Trash2 size={15} /></button>}
                </div>
              </div>
            ))}
            <button onClick={ajouterLigne} className="flex items-center gap-2 text-navy-dark border border-dashed border-navy-dark px-4 py-2 rounded-lg text-sm hover:bg-navy-dark hover:text-white transition mt-2">
              <Plus size={15} /> Ajouter une ligne
            </button>
          </div>
          <div className="border-t border-gray-100 p-4">
            <div className="ml-auto max-w-xs space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Sous-total HT</span><span>{totalHT.toLocaleString('fr-FR')} FCFA</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">TVA (18%)</span><span>{tva.toLocaleString('fr-FR')} FCFA</span></div>
              <div className="flex justify-between text-base font-bold border-t pt-2"><span className="text-navy-dark">TOTAL TTC</span><span>{totalTTC.toLocaleString('fr-FR')} FCFA</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENT IMPRIMABLE */}
      <PrintDocument
        type="devis"
        destinataire={client}
        lignes={lignes}
        totalHT={totalHT}
        tva={tva}
        totalTTC={totalTTC}
        modalite={modalite}
        validite={validite}
      />
    </div>
  )
}