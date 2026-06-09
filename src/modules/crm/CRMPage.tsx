import { useState } from 'react'
import type { Lead, StatusLead, Orcamento, StatusOrcamento } from '@/types'
import { formatMoeda, tempoDecorrido, nomeProduto } from '@/lib/utils'
import { Phone, Plus, Clock, FileText, Users, MessageSquare, PhoneMissed, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModalDetalheLead } from './ModalDetalheLead'
import { ModalNovoLead } from './ModalNovoLead'
import { useDataStore } from '@/store/dataStore'

const colunas: { status: StatusLead; label: string; emoji: string; cor: string; corHeader: string }[] = [
  { status: 'novo', label: 'Novo Lead', emoji: '📥', cor: 'border-gray-200', corHeader: 'bg-gray-50' },
  { status: 'em_contato', label: 'Em Contato', emoji: '💬', cor: 'border-blue-200', corHeader: 'bg-blue-50' },
  { status: 'nao_responde', label: 'Não Responde', emoji: '🔇', cor: 'border-amber-200', corHeader: 'bg-amber-50' },
  { status: 'so_chamou', label: 'Só Chamou', emoji: '📵', cor: 'border-purple-200', corHeader: 'bg-purple-50' },
  { status: 'orcamento_enviado', label: 'Orçamento Enviado', emoji: '📋', cor: 'border-yellow-200', corHeader: 'bg-yellow-50' },
  { status: 'aguardando', label: 'Aguardando', emoji: '⏳', cor: 'border-orange-200', corHeader: 'bg-orange-50' },
  { status: 'convertido', label: 'Convertido', emoji: '✅', cor: 'border-green-200', corHeader: 'bg-green-50' },
]

function CardLead({ lead, qtdOrcamentos, onClick }: { lead: Lead; qtdOrcamentos: number; onClick: () => void }) {
  const diasSemContato = Math.floor((new Date().getTime() - lead.dataContato.getTime()) / 86400000)
  const alerta = lead.status === 'aguardando' && diasSemContato >= 3

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition-all',
        alerta ? 'border-orange-300' : 'border-gray-100'
      )}
    >
      {alerta && (
        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1 mb-2">
          <Clock size={11} />
          <span>Sem contato há {diasSemContato} dias</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-sm text-gray-800 leading-tight">{lead.nome}</p>
        <div className="flex items-center gap-1 shrink-0">
          {qtdOrcamentos > 0 && (
            <span className="flex items-center gap-0.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
              <FileText size={10} />
              {qtdOrcamentos}
            </span>
          )}
          {lead.valorEstimado && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
              {formatMoeda(lead.valorEstimado)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{nomeProduto(lead.produto)}{lead.ambiente ? ` · ${lead.ambiente}` : ''}</p>
        {lead.largura && lead.altura && (
          <p>{lead.largura}m × {lead.altura}m{lead.cor ? ` · ${lead.cor}` : ''}</p>
        )}
        {lead.nomeCampanha && (
          <p className="text-blue-600">📢 {lead.nomeCampanha}</p>
        )}
        {lead.observacoes && (lead.status === 'nao_responde' || lead.status === 'so_chamou') && (
          <p className="text-gray-400 italic">{lead.observacoes}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">{tempoDecorrido(lead.dataContato)}</span>
        <a
          href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
        >
          <Phone size={11} />
          WhatsApp
        </a>
      </div>
    </div>
  )
}

export function CRMPage() {
  const { leads, orcamentos, leadsCarregados, adicionarLead, atualizarStatusLeadRemoto, adicionarOrcamento, atualizarStatusOrcamento } = useDataStore()
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null)
  const [novoLeadOpen, setNovoLeadOpen] = useState(false)

  const leadsAtivos = leads.filter(l => l.status !== 'perdido')

  // Métricas
  const totalLeads = leads.length
  const emConversa = leads.filter(l => l.status === 'em_contato' || l.status === 'orcamento_enviado' || l.status === 'aguardando').length
  const naoRespondem = leads.filter(l => l.status === 'nao_responde').length
  const soChamou = leads.filter(l => l.status === 'so_chamou').length
  const convertidos = leads.filter(l => l.status === 'convertido').length
  const perdidos = leads.filter(l => l.status === 'perdido').length
  const taxaConversao = totalLeads > 0 ? ((convertidos / totalLeads) * 100).toFixed(1) : '0'
  const taxaAbandono = totalLeads > 0 ? (((naoRespondem + soChamou + perdidos) / totalLeads) * 100).toFixed(1) : '0'

  function moverLead(leadId: string, novoStatus: StatusLead) {
    atualizarStatusLeadRemoto(leadId, novoStatus)
    if (leadSelecionado?.id === leadId) {
      setLeadSelecionado(prev => prev ? { ...prev, status: novoStatus } : null)
    }
  }

  function criarOrcamento(orc: Orcamento) {
    adicionarOrcamento(orc)
  }

  function atualizarOrcamento(id: string, status: StatusOrcamento) {
    atualizarStatusOrcamento(id, status)
  }

  function converterPedido(orc: Orcamento) {
    moverLead(orc.leadId, 'convertido')
    alert(`Pedido criado para ${orc.leadNome}!\n\nEm breve: integração automática com a aba Pedidos.`)
  }

  function orcamentosDoLead(leadId: string) {
    return orcamentos.filter(o => o.leadId === leadId)
  }

  if (!leadsCarregados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM — Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{totalLeads} leads no total</p>
        </div>
        <button
          onClick={() => setNovoLeadOpen(true)}
          className="flex items-center gap-2 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo Lead
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users size={15} className="text-gray-500" />
            <p className="text-xs text-gray-500">Total de leads</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalLeads}</p>
          <p className="text-xs text-gray-400 mt-0.5">{leadsAtivos.length} ativos</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={15} className="text-blue-500" />
            <p className="text-xs text-gray-500">Em conversa</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{emConversa}</p>
          <p className="text-xs text-gray-400 mt-0.5">seguiram a conversa</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <PhoneMissed size={15} className="text-amber-500" />
            <p className="text-xs text-gray-500">Não respondem</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{naoRespondem + soChamou}</p>
          <p className="text-xs text-gray-400 mt-0.5">{soChamou} só chamaram · {naoRespondem} sumiram</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-green-600" />
            <p className="text-xs text-gray-500">Conversão / Abandono</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{taxaConversao}%</p>
          <p className="text-xs text-red-400 mt-0.5">{taxaAbandono}% abandonaram</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {colunas.map(col => {
          const leadsColuna = leadsAtivos.filter(l => l.status === col.status)
          return (
            <div key={col.status} className={cn('rounded-xl border flex-shrink-0 w-64', col.cor)}>
              <div className={cn('px-4 py-3 rounded-t-xl flex items-center justify-between', col.corHeader)}>
                <div className="flex items-center gap-2">
                  <span>{col.emoji}</span>
                  <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                </div>
                <span className="bg-white/80 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {leadsColuna.length}
                </span>
              </div>
              <div className="p-3 space-y-3 min-h-40">
                {leadsColuna.map(lead => (
                  <CardLead
                    key={lead.id}
                    lead={lead}
                    qtdOrcamentos={orcamentosDoLead(lead.id).length}
                    onClick={() => setLeadSelecionado(lead)}
                  />
                ))}
                {leadsColuna.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">Nenhum lead aqui</p>
                )}
              </div>
            </div>
          )
        })}

        {/* Coluna Perdidos */}
        <div className="rounded-xl border border-red-200 flex-shrink-0 w-64">
          <div className="px-4 py-3 rounded-t-xl bg-red-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>❌</span>
              <span className="text-sm font-semibold text-gray-700">Perdidos</span>
            </div>
            <span className="bg-white/80 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {perdidos}
            </span>
          </div>
          <div className="p-3 space-y-3 min-h-40">
            {leads.filter(l => l.status === 'perdido').map(lead => (
              <div key={lead.id} className="bg-white rounded-xl p-3 border border-red-100 opacity-60">
                <p className="font-semibold text-sm text-gray-700">{lead.nome}</p>
                <p className="text-xs text-gray-400 mt-1">{nomeProduto(lead.produto)}</p>
                {lead.observacoes && <p className="text-xs text-red-400 mt-1">{lead.observacoes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {leadSelecionado && (
        <ModalDetalheLead
          lead={leadSelecionado}
          orcamentos={orcamentosDoLead(leadSelecionado.id)}
          onClose={() => setLeadSelecionado(null)}
          onMover={(status) => moverLead(leadSelecionado.id, status)}
          onCriarOrcamento={criarOrcamento}
          onAtualizarOrcamento={atualizarOrcamento}
          onConverterPedido={converterPedido}
        />
      )}

      {novoLeadOpen && (
        <ModalNovoLead
          onClose={() => setNovoLeadOpen(false)}
          onSalvar={(lead) => {
            adicionarLead(lead)
            setNovoLeadOpen(false)
          }}
        />
      )}
    </div>
  )
}
