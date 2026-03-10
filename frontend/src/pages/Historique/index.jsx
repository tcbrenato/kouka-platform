import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { History, Printer, Trash2, FileText, ClipboardList, ShoppingCart, Download, Share2, Pencil, X, Save, Mail, MessageCircle, Copy } from 'lucide-react'
import PrintDocument, { genererPDF } from '../../components/PrintDocument'

export default function Historique() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filtre, setFiltre] = useState('tous')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [partageDoc, setPartageDoc] = useState(null)

  useEffect(() => { fetchDocuments() }, [])

  async function fetchDocuments() {
    setLoading(true)
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
    if (data) setDocuments(data)
    setLoading(false)
  }

  async function supprimerDocument(id) {
    if (!window.confirm('Supprimer ce document définitivement ?')) return
    await supabase.from('documents').delete().eq('id', id)
    setSelected(null)
    fetchDocuments()
  }

  async function sauvegarderModification() {
    const { error } = await supabase.from('documents').update({
      client_nom: editForm.client_nom,
      client_adresse: editForm.client_adresse,
      client_tel: editForm.client_tel,
      client_email: editForm.client_email,
    }).eq('id', editing)
    if (!error) { setEditing(null); fetchDocuments() }
  }

  function imprimer(doc) {
    setSelected(doc)
    setTimeout(() => window.print(), 300)
  }

  function telechargerPDF(doc) {
    setSelected(doc)
    setTimeout(() => {
      genererPDF('document-imprimable', `${doc.numero}.pdf`)
    }, 300)
  }

  const typeIcon = {
    facture: <FileText size={15} className="text-blue-400" />,
    devis: <ClipboardList size={15} className="text-green-400" />,
    bon_commande: <ShoppingCart size={15} className="text-orange-400" />
  }

  const typeLabel = {
    facture: 'Facture',
    devis: 'Devis / Proforma',
    bon_commande: 'Bon de Commande'
  }

  const typeBadge = {
    facture: 'bg-blue-50 text-blue-600',
    devis: 'bg-green-50 text-green-600',
    bon_commande: 'bg-orange-50 text-orange-600'
  }

  const documentsFiltrés = filtre === 'tous' ? documents : documents.filter(d => d.type === filtre)

  return (
    <div className="space-y-6 pb-10">

      {/* ZONE IMPRESSION */}
      {selected && (
        <PrintDocument
          type={selected.type}
          destinataire={{ nom: selected.client_nom, adresse: selected.client_adresse, tel: selected.client_tel, email: selected.client_email }}
          lignes={selected.lignes}
          totalHT={selected.total_ht}
          tva={selected.tva}
          aib={selected.type === 'bon_commande' ? selected.total_ht * 0.01 : 0}
          totalTTC={selected.total_ttc}
          modalite={selected.type === 'bon_commande' ? 'Paiement sous 30 jours à réception de la facture.' : selected.type === 'devis' ? '70% à la commande\n30% à la livraison' : ''}
          validite={selected.type === 'devis' ? '15' : null}
        />
      )}

      <div className="no-print space-y-6">

        {/* MODAL PARTAGE */}
        {partageDoc && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPartageDoc(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy-dark">Partager le document</h3>
                <button onClick={() => setPartageDoc(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <span className="font-semibold">{typeLabel[partageDoc.type]}</span> — {partageDoc.numero}<br />
                <span className="font-semibold">{partageDoc.client_nom}</span><br />
                Total TTC : <span className="font-semibold">{Number(partageDoc.total_ttc).toLocaleString('fr-FR')} FCFA</span>
              </p>
              <div className="space-y-3">

                {/* ✅ CORRIGÉ : <a href=... ajouté */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`*${typeLabel[partageDoc.type]}* N°${partageDoc.numero}\nClient: ${partageDoc.client_nom}\nTotal TTC: ${Number(partageDoc.total_ttc).toLocaleString('fr-FR')} FCFA\n\nMALAK AND CO - KOUKA\nTel: 01 61 81 81 81`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 w-full bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-green-600 transition"
                >
                  <MessageCircle size={18} />
                  Partager sur WhatsApp
                </a>

                {/* ✅ CORRIGÉ : <a href=... ajouté */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`${typeLabel[partageDoc.type]} N°${partageDoc.numero} - MALAK AND CO`)}&body=${encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-dessous les details du document :\n\n${typeLabel[partageDoc.type]} N ${partageDoc.numero}\nClient : ${partageDoc.client_nom}\nTotal TTC : ${Number(partageDoc.total_ttc).toLocaleString('fr-FR')} FCFA\n\nCordialement,\nMALAK AND CO - KOUKA\nTel : 01 61 81 81 81`)}`}
                  className="flex items-center gap-3 w-full bg-blue-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-600 transition"
                >
                  <Mail size={18} />
                  Envoyer par Email
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${typeLabel[partageDoc.type]} N°${partageDoc.numero}\nClient: ${partageDoc.client_nom}\nTotal TTC: ${Number(partageDoc.total_ttc).toLocaleString('fr-FR')} FCFA\nMALAK AND CO - Tel: 01 61 81 81 81`)
                    alert('Copié !')
                  }}
                  className="flex items-center gap-3 w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                >
                  <Copy size={18} />
                  Copier les infos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TITRE */}
        <div className="flex items-center gap-3">
          <History className="text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-navy-dark">Historique des documents</h2>
        </div>

        {/* FILTRES */}
        <div className="flex gap-2 flex-wrap">
          {['tous', 'facture', 'devis', 'bon_commande'].map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtre === f ? 'bg-navy-dark text-white' : 'bg-white text-navy-dark border border-gray-200 hover:border-navy-dark'}`}>
              {f === 'tous' ? 'Tous' : typeLabel[f]}
            </button>
          ))}
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-navy-dark text-white px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Documents sauvegardés</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{documentsFiltrés.length} document(s)</span>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement...</div>
          ) : documentsFiltrés.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <History size={32} className="mx-auto mb-2 opacity-30" />
              <p>Aucun document trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Numéro</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Client / Fournisseur</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Total TTC</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                    <th className="px-4 py-3 text-center text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documentsFiltrés.map((doc, i) => (
                    <>
                      <tr key={doc.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${typeBadge[doc.type]}`}>
                            {typeIcon[doc.type]}{typeLabel[doc.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{doc.numero}</td>
                        <td className="px-4 py-3 font-medium text-navy-dark">{doc.client_nom}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy-dark">
                          {Number(doc.total_ttc).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(doc.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-center">
                            <button onClick={() => imprimer(doc)} className="p-1.5 rounded-lg text-navy-dark hover:bg-navy-dark hover:text-white transition" title="Imprimer">
                              <Printer size={14} />
                            </button>
                            <button onClick={() => telechargerPDF(doc)} className="p-1.5 rounded-lg text-green-600 hover:bg-green-600 hover:text-white transition" title="Télécharger PDF">
                              <Download size={14} />
                            </button>
                            <button onClick={() => setPartageDoc(doc)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition" title="Partager">
                              <Share2 size={14} />
                            </button>
                            <button
                              onClick={() => { setEditing(doc.id); setEditForm({ client_nom: doc.client_nom, client_adresse: doc.client_adresse, client_tel: doc.client_tel, client_email: doc.client_email }) }}
                              className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white transition" title="Modifier">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => supprimerDocument(doc.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400 hover:text-white transition" title="Supprimer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {editing === doc.id && (
                        <tr key={`edit-${doc.id}`} className="bg-yellow-50 border-b border-yellow-100">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Nom / Raison sociale</label>
                                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={editForm.client_nom} onChange={e => setEditForm({ ...editForm, client_nom: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Téléphone</label>
                                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={editForm.client_tel || ''} onChange={e => setEditForm({ ...editForm, client_tel: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
                                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={editForm.client_adresse || ''} onChange={e => setEditForm({ ...editForm, client_adresse: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={editForm.client_email || ''} onChange={e => setEditForm({ ...editForm, client_email: e.target.value })} />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={sauvegarderModification} className="flex items-center gap-2 bg-navy-dark text-white px-4 py-2 rounded-lg text-sm hover:bg-navy-light transition">
                                <Save size={14} /> Sauvegarder
                              </button>
                              <button onClick={() => setEditing(null)} className="flex items-center gap-2 border border-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                                <X size={14} /> Annuler
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {['facture', 'devis', 'bon_commande'].map(t => {
            const docs = documents.filter(d => d.type === t)
            const total = docs.reduce((sum, d) => sum + Number(d.total_ttc), 0)
            return (
              <div key={t} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 mb-2">
                  {typeIcon[t]}
                  <span className="text-sm font-semibold text-navy-dark">{typeLabel[t]}s</span>
                </div>
                <div className="text-2xl font-bold text-navy-dark">{docs.length}</div>
                <div className="text-xs text-gray-400 mt-1">Total : {total.toLocaleString('fr-FR')} FCFA</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}