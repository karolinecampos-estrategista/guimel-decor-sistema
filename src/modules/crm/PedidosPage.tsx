import { useState } from 'react'
import type { Pedido, StatusPedido } from '@/types'
import { formatMoeda, formatData, labelStatusPedido, corStatusPedido, nomeProduto, cn } from '@/lib/utils'
import { Phone, Calendar, MapPin, Plus, Search, Filter } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import { ModalDetalhePedido } from './ModalDetalhePedido'

type Filtro = 'todos' | StatusPedido

const filtros: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'aguardando_producao', label: 'Aguardando' },
  { key: 'em_producao', label: 'Em Produção' },
  { key: 'pronto_retirada', label: 'Pronto' },
  { key: 'instalacao_agendada', label: 'Instalação Agendada' },
  { key: 'instalado', label: 'Instalado' },
  { key: 'concluido', label: 'Concluído' },
]

export function PedidosPage() {
  const { pedidos } = useDataStore()
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busca, setBusca] = useState('')
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)

  const filtrados = pedidos
    .filter(p => filtro === 'todos' || p.status === filtro)
    .filter(p =>
      !busca ||
      p.leadNome.toLowerCase().includes(busca.toLowerCase()) ||
      p.numeroPedido.toLowerCase().includes(busca.toLowerCase()) ||
      p.cidade?.toLowerCase().includes(busca.toLowerCase())
    )

  const ativos = pedidos.filter(p => !['concluido', 'cancelado'].includes(p.status))
  const totalMes = pedidos.filter(p => {
    const d = new Date(p.criadoEm)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const faturamentoMes = totalMes.reduce((acc, p) => acc + p.valorTotal, 0)
  const saldoPendente = ativos.reduce((acc, p) => acc + p.valorRestante, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {ativos.length} ativos · {pedidos.filter(p => p.status === 'concluido').length} concluídos
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Pedidos ativos</p>
          <p className="text-2xl font-bold text-[#2D2D2D]">{ativos.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">em andamento</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Faturamento do mês</p>
          <p className="text-2xl font-bold text-green-700">{formatMoeda(faturamentoMes)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{totalMes.length} pedidos</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Saldo a receber</p>
          <p className="text-2xl font-bold text-blue-700">{formatMoeda(saldoPendente)}</p>
          <p className="text-xs text-gray-400 mt-0.5">pendente de cobrança</p>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por cliente, número ou cidade..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filtros.map(f => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                filtro === f.key
                  ? 'bg-[#2D2D2D] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {f.label}
              {f.key !== 'todos' && (
                <span className="ml-1 text-xs opacity-70">
                  ({pedidos.filter(p => p.status === f.key).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(p => (
            <div
              key={p.id}
              onClick={() => setPedidoSelecionado(p)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2D2D2D]/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-xs text-gray-400">{p.numeroPedido}</p>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', corStatusPedido(p.status))}>
                      {labelStatusPedido(p.status)}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 group-hover:text-[#2D2D2D]">{p.leadNome}</p>
                  <p className="text-sm text-gray-500">
                    {nomeProduto(p.tipoProduto)}{p.cor ? ` ${p.cor}` : ''} · {p.largura}m × {p.altura}m
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-[#2D2D2D]">{formatMoeda(p.valorTotal)}</p>
                  {p.valorRestante > 0 && (
                    <p className="text-xs text-red-500 mt-0.5">Restante: {formatMoeda(p.valorRestante)}</p>
                  )}
                  {p.valorRestante === 0 && (
                    <p className="text-xs text-green-600 mt-0.5">✓ Pago</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Phone size={11} />
                  <a
                    href={`https://wa.me/55${p.telefone.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-green-600 hover:underline"
                  >
                    {p.telefone}
                  </a>
                </span>
                {p.dataPrevistanInstalacao && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} />
                    Instalação: {formatData(new Date(p.dataPrevistanInstalacao))}
                  </span>
                )}
                {p.cidade && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={11} />
                    {p.cidade}
                  </span>
                )}
              </div>

              {/* Progresso */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {[
                  { label: 'Pedido', done: true },
                  { label: 'Sinal', done: p.valorSinal > 0 },
                  { label: 'Produção', done: ['em_producao', 'pronto_retirada', 'instalacao_agendada', 'instalado', 'concluido'].includes(p.status) },
                  { label: 'Pronto', done: ['pronto_retirada', 'instalacao_agendada', 'instalado', 'concluido'].includes(p.status) },
                  { label: 'Instalado', done: ['instalado', 'concluido'].includes(p.status) },
                  { label: 'Concluído', done: p.status === 'concluido' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={cn('w-4 h-4 rounded-full flex items-center justify-center text-xs',
                      step.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'
                    )}>
                      {step.done ? '✓' : ''}
                    </div>
                    <span className={cn('text-xs', step.done ? 'text-green-700 font-medium' : 'text-gray-300')}>
                      {step.label}
                    </span>
                    {i < 5 && <span className="text-gray-200 text-xs">›</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {pedidoSelecionado && (
        <ModalDetalhePedido
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
        />
      )}
    </div>
  )
}
