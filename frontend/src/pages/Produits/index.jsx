import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Package } from 'lucide-react'

export default function Produits() {
  const [produits, setProduits] = useState([])
  const [form, setForm] = useState({ code: '', designation: '', prix_unitaire: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { fetchProduits() }, [])

  async function fetchProduits() {
    const { data } = await supabase.from('produits').select('*').order('designation')
    if (data) setProduits(data)
  }

  async function ajouterProduit() {
    if (!form.designation || !form.prix_unitaire) {
      setMessage('⚠️ Désignation et prix obligatoires')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    setLoading(true)
    const { error } = await supabase.from('produits').insert([{
      code: form.code,
      designation: form.designation,
      prix_unitaire: parseFloat(form.prix_unitaire)
    }])
    if (!error) {
      setMessage('✅ Produit ajouté !')
      setForm({ code: '', designation: '', prix_unitaire: '' })
      fetchProduits()
    }
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function supprimerProduit(id) {
    if (!window.confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    fetchProduits()
  }

  return (
    <div className="space-y-6 pb-10">
      {/* TITRE */}
      <div className="flex items-center gap-3">
        <Package className="text-yellow-500" size={24} />
        <h2 className="text-xl font-bold text-navy-dark">Catalogue Produits</h2>
      </div>

      {/* FORMULAIRE AJOUT */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
        <h3 className="font-semibold text-navy-dark text-sm uppercase tracking-wide">
          Nouveau produit
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Code (optionnel)</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Ex: 5575894"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Désignation *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Ex: Farine T65"
              value={form.designation}
              onChange={e => setForm({ ...form, designation: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Prix unitaire (FCFA) *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Ex: 19692"
              type="number"
              value={form.prix_unitaire}
              onChange={e => setForm({ ...form, prix_unitaire: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={ajouterProduit}
            disabled={loading}
            className="flex items-center gap-2 bg-navy-dark text-white px-5 py-2 rounded-lg text-sm hover:bg-navy-light transition disabled:opacity-50"
          >
            <Plus size={16} />
            {loading ? 'Enregistrement...' : 'Ajouter au catalogue'}
          </button>
          {message && (
            <span className={`text-sm font-medium ${message.includes('⚠️') ? 'text-orange-500' : 'text-green-600'}`}>
              {message}
            </span>
          )}
        </div>
      </div>

      {/* LISTE PRODUITS */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-navy-dark text-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Produits enregistrés</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{produits.length} produit(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Code</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Désignation</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Prix (FCFA)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.code || '—'}</td>
                  <td className="px-4 py-3 font-medium text-navy-dark">{p.designation}</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-dark">
                    {Number(p.prix_unitaire).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => supprimerProduit(p.id)}
                      className="text-red-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {produits.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-300">
                    <Package size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Aucun produit enregistré</p>
                    <p className="text-xs mt-1">Ajoutez votre premier produit ci-dessus</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}