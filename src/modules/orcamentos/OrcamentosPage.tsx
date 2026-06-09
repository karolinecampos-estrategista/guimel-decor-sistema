import { useState } from 'react'
import { mockOrcamentos } from '@/lib/mockData'
import type { Orcamento, StatusOrcamento } from '@/types'
import { formatMoeda, formatData, nomeProduto, cn } from '@/lib/utils'
import { Plus, FileText, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { ModalNovoOrcamento } from './ModalNovoOrcamento'
import { ModalDetalheOrcamento } from './ModalDetalheOrcamento'

type Filtro = 'todos' | StatusOrcamento

const filtros: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'rascunho', label: 'Rascunho' },
  { key: 'enviado', label: 'Enviado' },
  { key: 'aprovado', label: 'Aprovado' },
  { key: 'recusado', label: 'Recusado' },
]

const statusCor: Record<StatusOrcamento, string> = {
  rascunho: 'bg-gray-100 text-gray-600',
  enviado: 'bg-blue-100 text-blue-700',
  aprovado: 'bg-green-100 text-green-700',
  recusado: 'bg-red-100 text-red-700',
}

const statusLabel: Record<StatusOrcamento, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
}

export function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(mockOrcamentos)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [modalNovo, setModalNovo] = useState(false)
  const [orcamentoDetalhe, setOrcamentoDetalhe] = useState<Orcamento | null>(null)

  const filtrados = filtro === 'todos' ? orcamentos : orcamentos.filter(o => o.status === filtro)

  const totais = {
    todos: orcamentos.length,
    rascunho: orcamentos.filter(o => o.status === 'rascunho').length,
    enviado: orcamentos.filter(o => o.status === 'enviado').length,
    aprovado: orcamentos.filter(o => o.status === 'aprovado').length,
    recusado: orcamentos.filter(o => o.status === 'recusado').length,
  }

  const valorAprovado = orcamentos
    .filter(o => o.status === 'aprovado')
    .reduce((acc, o) => acc + o.valorFinal, 0)

  const valorPendente = orcamentos
    .filter(o => o.status === 'enviado')
    .reduce((acc, o) => acc + o.valorFinal, 0)

  const taxaConversao = orcamentos.length > 0
    ? Math.round((totais.aprovado / (orcamentos.length - totais.rascunho - totais.recusado || 1)) * 100)
    : 0

  function salvarOrcamento(orc: Orcamento) {
    setOrcamentos(prev => [orc, ...prev])
    setModalNovo(false)
  }

  function atualizarStatus(id: string, status: StatusOrcamento) {
    setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (orcamentoDetalhe?.id === id) {
      setOrcamentoDetalhe(prev => prev ? { ...prev, status } : null)
    }
  }

  function converterPedido(orc: Orcamento) {
    alert(`Pedido criado para ${orc.leadNome}!\n\nEm breve: integração automática com a aba Pedidos.`)
    setOrcamentoDetalhe(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orcamentos.length} orçamentos · {totais.aprovado} aprovados
          </p>
        </div>
        <button
          onClick={() => setModalNovo(true)}
          className="flex items-center gap-2 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo Orçamento
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={15} className="text-green-600" />
            <p className="text-xs text-gray-500">Valor aprovado</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatMoeda(valorAprovado)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{totais.aprovado} orçamento{totais.aprovado !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={15} className="text-blue-500" />
            <p className="text-xs text-gray-500">Aguardando aprovação</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{formatMoeda(valorPendente)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{totais.enviado} enviado{totais.enviado !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-[#2D2D2D]" />
            <p className="text-xs text-gray-500">Taxa de conversão</p>
          </div>
          <p className="text-2xl font-bold text-[#2D2D2D]">{taxaConversao}%</p>
          <p className="text-xs text-gray-400 mt-0.5">dos orçamentos enviados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {filtros.map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              filtro === f.key
                ? 'bg-[#2D2D2D] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {f.label}
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-bold',
              filtro === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            )}>
              {totais[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhum orçamento encontrado</p>
          <p className="text-gray-400 text-sm mt-1">Crie um novo orçamento para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtrados.map(o => (
            <div
              key={o.id}
              onClick={() => setOrcamentoDetalhe(o)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2D2D2D]/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-400">{o.numeroOrcamento}</p>
                  <p className="font-bold text-gray-900 mt-0.5 group-hover:text-[#2D2D2D] transition-colors">{o.leadNome}</p>
                  <p className="text-sm text-gray-500">{nomeProduto(o.tipoProduto)}{o.ambiente ? ` · ${o.ambiente}` : ''}</p>
                </div>
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium shrink-0', statusCor[o.status])}>
                  {statusLabel[o.status]}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-3">
                <div>
                  <p className="text-gray-400">Medidas</p>
                  <p className="font-medium text-gray-700">{o.largura}m × {o.altura}m</p>
                </div>
                {o.tecido && (
                  <div>
                    <p className="text-gray-400">Tecido</p>
                    <p className="font-medium text-gray-700 truncate">{o.tecido}{o.cor ? ` · ${o.cor}` : ''}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Prazo</p>
                  <p className="font-medium text-gray-700">{o.prazoEntrega} dias úteis</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="text-xs text-gray-400">
                  <span>Produto: {formatMoeda(o.valorProduto)}</span>
                  <span className="mx-1">·</span>
                  <span>Instalação: {formatMoeda(o.valorInstalacao)}</span>
                </div>
                <p className="text-xl font-bold text-[#2D2D2D]">{formatMoeda(o.valorFinal)}</p>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={e => { e.stopPropagation(); setOrcamentoDetalhe(o) }}
                  className="flex-1 text-xs border border-gray-200 hover:bg-gray-50 py-1.5 rounded-lg text-gray-600 transition-colors flex items-center justify-center gap-1"
                >
                  <FileText size={12} />
                  Ver orçamento
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    const produto = o.tipoProduto === 'papel_de_parede' ? 'Papel de Parede' : nomeProduto(o.tipoProduto)
                    const msg = encodeURIComponent(
                      `Olá ${o.leadNome}! 😊\n\nSegue seu orçamento da *Guimel Decor*:\n\n` +
                      `📋 *${o.numeroOrcamento}*\n🪟 *${produto}*\n📐 ${o.largura}m × ${o.altura}m\n\n` +
                      `💰 *Total: ${formatMoeda(o.valorFinal)}*\n⏱️ Prazo: ${o.prazoEntrega} dias úteis\n\nPara aprovar é só responder! 🙏`
                    )
                    window.open(`https://wa.me/?text=${msg}`, '_blank')
                  }}
                  className="flex-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <span>📱</span> Enviar WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      {modalNovo && (
        <ModalNovoOrcamento
          onClose={() => setModalNovo(false)}
          onSalvar={salvarOrcamento}
        />
      )}

      {orcamentoDetalhe && (
        <ModalDetalheOrcamento
          orcamento={orcamentoDetalhe}
          onClose={() => setOrcamentoDetalhe(null)}
          onAtualizarStatus={atualizarStatus}
          onConverterPedido={converterPedido}
        />
      )}
    </div>
  )
}
