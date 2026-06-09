import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { DashboardGestor } from '@/modules/gestor/DashboardGestor'
import { CRMPage } from '@/modules/crm/CRMPage'
import { PedidosPage } from '@/modules/crm/PedidosPage'
import { ProducaoPage } from '@/modules/producao/ProducaoPage'
import { EstoquePage } from '@/modules/producao/EstoquePage'
import { InstalacoesPage } from '@/modules/instalacao/InstalacoesPage'
import { FinanceiroPage } from '@/modules/financeiro/FinanceiroPage'
import { AnunciosPage } from '@/modules/anuncios/AnunciosPage'
import { OrcamentosPage } from '@/modules/orcamentos/OrcamentosPage'
import { ConfiguracoesPage } from '@/modules/configuracoes/ConfiguracoesPage'
import { useDataStore } from '@/store/dataStore'
import { supabase } from '@/lib/supabase'
import { rowToLead } from '@/lib/leadMapper'
import type { LeadRow } from '@/lib/supabase'

function App() {
  const { carregarLeads, adicionarLead, atualizarStatusLead } = useDataStore()

  useEffect(() => {
    carregarLeads()

    // Realtime: novo lead chega e aparece automaticamente no CRM
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        adicionarLead(rowToLead(payload.new as LeadRow))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        const lead = rowToLead(payload.new as LeadRow)
        atualizarStatusLead(lead.id, lead.status)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardGestor />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="orcamentos" element={<OrcamentosPage />} />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="producao" element={<ProducaoPage />} />
          <Route path="estoque" element={<EstoquePage />} />
          <Route path="instalacoes" element={<InstalacoesPage />} />
          <Route path="financeiro" element={<FinanceiroPage />} />
          <Route path="anuncios" element={<AnunciosPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
