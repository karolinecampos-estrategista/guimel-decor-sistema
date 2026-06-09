import { useState } from 'react'
import { mockOrdens } from '@/lib/mockData'
import type { OrdemProducao, StatusOrdemProducao } from '@/types'
import { formatData, nomeProduto, labelStatusOrdem, cn } from '@/lib/utils'
import { Clock, AlertTriangle, CheckCircle, Package, Truck } from 'lucide-react'
import { isAfter, isBefore, addDays } from 'date-fns'

const hoje = new Date()

const colunas: { status: StatusOrdemProducao; label: string; emoji: string; cor: string }[] = [
  { status: 'pendente', label: 'Pendente', emoji: '📥', cor: 'border-yellow-200' },
  { status: 'em_andamento', label: 'Em Produção', emoji: '🔨', cor: 'border-blue-200' },
  { status: 'pronto', label: 'Pronto p/ Retirada', emoji: '✅', cor: 'border-green-200' },
  { status: 'retirado', label: 'Retirado', emoji: '📦', cor: 'border-gray-200' },
]

function CardOrdem({ ordem, onAtualizar }: { ordem: OrdemProducao; onAtualizar: (id: string, status: StatusOrdemProducao) => void }) {
  const diasRestantes = Math.ceil((new Date(ordem.prazoProducao).getTime() - hoje.getTime()) / 86400000)
  const atrasado = diasRestantes < 0 && ordem.status !== 'pronto' && ordem.status !== 'retirado'
  const urgente = diasRestantes >= 0 && diasRestantes <= 2 && ordem.status !== 'pronto' && ordem.status !== 'retirado'

  const proximoStatus: Record<StatusOrdemProducao, StatusOrdemProducao | null> = {
    pendente: 'em_andamento',
    em_andamento: 'pronto',
    pronto: 'retirado',
    retirado: null,
  }

  const botaoLabel: Record<StatusOrdemProducao, string> = {
    pendente: 'Iniciar Produção',
    em_andamento: 'Marcar como Pronto',
    pronto: 'Confirmar Retirada',
    retirado: '',
  }

  return (
    <div className={cn('bg-white rounded-xl p-4 shadow-sm border transition-all', atrasado ? 'border-red-300' : urgente ? 'border-orange-300' : 'border-gray-100')}>
      {atrasado && (
        <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1 mb-2">
          <AlertTriangle size={11} />
          <span>ATRASADO — {Math.abs(diasRestantes)} dias</span>
        </div>
      )}
      {urgente && (
        <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1 mb-2">
          <Clock size={11} />
          <span>Prazo em {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''}</span>
        </div>
      )}

      <p className="font-mono text-xs text-gray-400 mb-1">{ordem.numeroPedido}</p>
      <p className="font-semibold text-sm text-gray-800">{ordem.clienteNome}</p>
      <p className="text-xs text-gray-600 mt-1">{nomeProduto(ordem.tipoProduto)} {ordem.cor}</p>
      <p className="text-xs text-gray-500">{ordem.largura}m × {ordem.altura}m · {ordem.tecido}</p>

      <div className="mt-3 flex items-center justify-between">
        <div>
          {ordem.materialEmEstoque ? (
            <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={11} />Material ok</span>
          ) : (
            <span className="text-xs text-orange-500 flex items-center gap-1"><AlertTriangle size={11} />Comprar material</span>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Prazo: {formatData(new Date(ordem.prazoProducao))}</p>
        </div>
      </div>

      {ordem.observacoes && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1.5 mt-2">{ordem.observacoes}</p>
      )}

      {proximoStatus[ordem.status] && (
        <button
          onClick={() => onAtualizar(ordem.id, proximoStatus[ordem.status]!)}
          className="mt-3 w-full text-xs bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white py-2 rounded-lg font-medium transition-colors"
        >
          {botaoLabel[ordem.status]}
        </button>
      )}
    </div>
  )
}

export function ProducaoPage() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>(mockOrdens)

  function atualizarStatus(id: string, status: StatusOrdemProducao) {
    setOrdens(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const atrasadas = ordens.filter(o => isBefore(new Date(o.prazoProducao), hoje) && !['pronto', 'retirado'].includes(o.status))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produção</h1>
          <p className="text-gray-500 text-sm mt-1">
            {ordens.filter(o => o.status !== 'retirado').length} ordens ativas
            {atrasadas.length > 0 && <span className="text-red-600 ml-2">· {atrasadas.length} atrasada(s)!</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {colunas.map(col => {
          const items = ordens.filter(o => o.status === col.status)
          return (
            <div key={col.status} className={cn('rounded-xl border', col.cor)}>
              <div className="px-4 py-3 bg-white rounded-t-xl flex items-center justify-between border-b">
                <span className="text-sm font-semibold text-gray-700">{col.emoji} {col.label}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="p-3 space-y-3 min-h-32 bg-gray-50/50 rounded-b-xl">
                {items.map(o => (
                  <CardOrdem key={o.id} ordem={o} onAtualizar={atualizarStatus} />
                ))}
                {items.length === 0 && <p className="text-xs text-gray-400 text-center py-6">Vazio</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
