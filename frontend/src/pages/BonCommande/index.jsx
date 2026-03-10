import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, ShoppingCart, Printer } from 'lucide-react'
import PrintDocument from '../../components/PrintDocument'

const TVA_RATE = 0.18
const AIB_RATE = 0.01

export default function BonCommande() {
  const [produits, setProduits] = useState([])
  const [fournisseur, setFournisseur] = useState({ nom: '', adresse: '', tel: '', email: '', ifu: '', rccm: '' })
  const [lignes, setLignes] = useState([{ designation: '', quantite: 1, prix_unitaire: 0 }])
  const [modalite, setModalite] = useState('Paiement sous 30 jours à réception de la facture.')
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
  const aib = totalHT * AIB_RATE
  const tva = totalHT * TVA_RATE
  const totalTTC = totalHT + aib + tva

  async function sauvegarder() {
    if (!fournisseur.nom) {
      setMessage('⚠️ Nom du fournisseur obligatoire')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    setSaving(true)
    const d = new Date()
    const numero = `BC-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`
    const { error } = await supabase.from('documents').insert([{
      type: 'bon_commande', numero,
      client_nom: fournisseur.nom, client_adresse: fournisseur.adresse,
      client_tel: fournisseur.tel, client_email: fournisseur.email,
      lignes, total_ht: totalHT, tva, total_ttc: totalTTC
    }])
    if (!error) { setMessage('✅ Bon de commande sauvegardé !'); setTimeout(() => setMessage(''), 3000) }
    setSaving(false)
  }

  return (
    <div className="space-y-6 pb-10">

      {/* FORMULAIRE - caché à l'impression */}
      <div className="no-print space-y-6">

        {/* TITRE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-navy-dark">Bon de Commande</h2>
          </div>
          <div className="flex gap-2">
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

        {/* INFOS FOURNISSEUR */}
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
          <h3 className="font-semibold text-navy-dark text-sm uppercase tracking-wide">Informations Fournisseur</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nom / Raison sociale *</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: STE LA ROCHE S.A.R.L" value={fournisseur.nom} onChange={e => setFournisseur({ ...fournisseur, nom: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Téléphone</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: +229 01 XX XX XX XX" value={fournisseur.tel} onChange={e => setFournisseur({ ...fournisseur, tel: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: 01 B.P 2525 Cotonou" value={fournisseur.adresse} onChange={e => setFournisseur({ ...fournisseur, adresse: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: fournisseur@email.com" value={fournisseur.email} onChange={e => setFournisseur({ ...fournisseur, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">IFU</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: 3200800673315" value={fournisseur.ifu} onChange={e => setFournisseur({ ...fournisseur, ifu: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">RCCM</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Ex: RB/COT 24 B 37142" value={fournisseur.rccm} onChange={e => setFournisseur({ ...fournisseur, rccm: e.target.value })} />
            </div>
          </div>
        </div>

        {/* MODALITES */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-semibold text-navy-dark text-sm uppercase tracking-wide mb-3">Modalités de paiement</h3>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" rows={2} value={modalite} onChange={e => setModalite(e.target.value)} />
        </div>

        {/* LIGNES PRODUITS */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-navy-dark text-white px-4 py-3">
            <span className="text-sm font-semibold">Produits commandés</span>
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
              <div className="flex justify-between text-sm"><span className="text-gray-500">AIB (1%)</span><span>{aib.toLocaleString('fr-FR')} FCFA</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">TVA (18%)</span><span>{tva.toLocaleString('fr-FR')} FCFA</span></div>
              <div className="flex justify-between text-base font-bold border-t pt-2"><span className="text-navy-dark">TOTAL TTC</span><span>{totalTTC.toLocaleString('fr-FR')} FCFA</span></div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-600 space-y-1">
          <p>📌 Le numéro du bon de commande doit être inscrit sur la facture du fournisseur.</p>
          <p>📌 Merci de joindre une copie du bon de commande à la facture.</p>
        </div>
      </div>

      {/* DOCUMENT IMPRIMABLE */}
      <PrintDocument
        type="bon_commande"
        destinataire={fournisseur}
        lignes={lignes}
        totalHT={totalHT}
        tva={tva}
        aib={aib}
        totalTTC={totalTTC}
        modalite={modalite}
      />
    </div>
  )
}