import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Facture from './pages/Facture'
import Devis from './pages/Devis'
import BonCommande from './pages/BonCommande'
import Produits from './pages/Produits'
import Historique from './pages/Historique'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/facture" />} />
          <Route path="facture" element={<Facture />} />
          <Route path="devis" element={<Devis />} />
          <Route path="bon-commande" element={<BonCommande />} />
          <Route path="produits" element={<Produits />} />
          <Route path="historique" element={<Historique />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App