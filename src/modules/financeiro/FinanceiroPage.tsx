import { useState } from 'react'
import { formatMoeda, formatData, labelStatusPedido, corStatusPedido, cn } from '@/lib/utils'
import { addDays, isBefore, isWithinInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from 'date-fns'
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  Clock, Plus, Upload, Filter, FileText, ShoppingBag, Wrench,
  CheckCircle, X, Save
} from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import type { ContaPagar } from '@/types'

type PeriodoFiltro = 'semana' | 'mes' | 'mes_anterior' | 'todos'
type AbaFin = 'visao_geral' | 'receber' | 'pagar' | 'lancamentos'

const categoriaCor: Record<string, string> = {
  instalador: 'bg-purple-100 text-purple-700',
  material: 'bg-blue-100 text-blue-700',
  marketing: 'bg-orange-100 text-orange-700',
  aluguel: 'bg-gray-100 text-gray-700',
  outros: 'bg-stone-100 text-stone-700',
}

const categorias = ['instalador', 'material', 'marketing', 'aluguel', 'outros']

const hoje = new Date()

export function FinanceiroPage() {
  const { pedidos, contasPagar, pagamentos, instalacoes, adicionarContaPagar, atualizarContaPagar, adicionarPagamento } = useDataStore()
  const [aba, setAba] = useState<AbaFin>('visao_geral')
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('mes')
  const [filtroCat, setFiltroCat] = useState<string>('todos')
  const [adicionandoConta, setAdicionandoConta] = useState(false)
  const [novaConta, setNovaConta] = useState<Partial<ContaPagar>>({
    descricao: '', valor: 0, categoria: 'material', status: 'pendente',
    dataVencimento: new Date(),
  })

  // Período
  const intervalo = {
    semana: { start: startOfWeek(hoje, { weekStartsOn: 1 }), end: endOfWeek(hoje, { weekStartsOn: 1 }) },
    mes: { start: startOfMonth(hoje), end: endOfMonth(hoje) },
    mes_anterior: { start: startOfMonth(subMonths(hoje, 1)), end: endOfMonth(subMonths(hoje, 1)) },
    todos: { start: new Date('2020-01-01'), end: addDays(hoje, 365) },
  }[periodo]

  const pagsFiltrados = pagamentos.filter(p =>
    p.confirmado && isWithinInterval(new Date(p.dataPagamento), intervalo)
  )
  const contasFiltradasPagar = contasPagar.filter(c =>
    (filtroCat === 'todos' || c.categoria === filtroCat) &&
    (c.dataVencimento ? isWithinInterval(new Date(c.dataVencimento), intervalo) : true)
  )

  const totalRecebido = pagsFiltrados.reduce((s, p) => s + p.valor, 0)
  const totalPago = contasPagar.filter(c => c.status === 'pago').reduce((s, c) => s + c.valor, 0)
  const totalAPagar = contasPagar.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0)
  const aReceberPedidos = pedidos.filter(p => p.valorRestante > 0 && p.status !== 'cancelado').reduce((s, p) => s + p.valorRestante, 0)
  const contasAtrasadas = contasPagar.filter(c => c.status === 'pendente' && isBefore(new Date(c.dataVencimento), hoje))

  // Por categoria (saídas)
  const porCategoria = categorias.map(cat => ({
    cat,
    total: contasPagar.filter(c => c.categoria === cat && c.status === 'pago').reduce((s, c) => s + c.valor, 0),
    pendente: contasPagar.filter(c => c.categoria === cat && c.status === 'pendente').reduce((s, c) => s + c.valor, 0),
  })).filter(c => c.total > 0 || c.pendente > 0)

  // Previsão instalações
  const recebimentosPrevistos = instalacoes
    .filter(i => isWithinInterval(new Date(i.dataAgendada), { start: hoje, end: addDays(hoje, 30) }))
    .map(i => {
      const p = pedidos.find(p => p.id === i.pedidoId)
      return p && p.valorRestante > 0
        ? { data: new Date(i.dataAgendada), valor: p.valorRestante, cliente: i.clienteNome, maquininha: i.levaMaquininha }
        : null
    })
    .filter(Boolean) as { data: Date; valor: number; cliente: string; maquininha: boolean }[]

  const pedidosPeriodo = pedidos.filter(p =>
    isWithinInterval(new Date(p.criadoEm), intervalo)
  )
  const pedidosSemana = pedidos.filter(p =>
    isWithinInterval(new Date(p.criadoEm), intervalo)
  )

  function salvarNovaConta() {
    if (!novaConta.descricao || !novaConta.valor) return
    adicionarContaPagar({
      id: `cp-${Date.now()}`,
      descricao: novaConta.descricao!,
      fornecedor: novaConta.fornecedor,
      valor: Number(novaConta.valor),
      dataVencimento: novaConta.dataVencimento ?? new Date(),
      categoria: novaConta.categoria ?? 'outros',
      status: 'pendente',
      observacoes: novaConta.observacoes,
    })
    setAdicionandoConta(false)
    setNovaConta({ descricao: '', valor: 0, categoria: 'material', status: 'pendente', dataVencimento: new Date() })
  }

  function marcarPago(conta: ContaPagar) {
    atualizarContaPagar({ ...conta, status: 'pago', dataPagamento: new Date() })
  }

  const abas: { key: AbaFin; label: string }[] = [
    { key: 'visao_geral', label: 'Visão Geral' },
    { key: 'receber', label: 'A Receber' },
    { key: 'pagar', label: 'A Pagar' },
    { key: 'lancamentos', label: 'Lançamentos' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-500 text-sm mt-1">Visão completa do caixa da Guimel Decor</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filtro período */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 text-xs">
            {(['semana', 'mes', 'mes_anterior', 'todos'] as PeriodoFiltro[]).map(p => (
              <button key={p} onClick={() => setPeriodo(p)}
                className={cn('px-3 py-1.5 rounded-md transition-colors font-medium',
                  periodo === p ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}>
                {p === 'semana' ? 'Semana' : p === 'mes' ? 'Este mês' : p === 'mes_anterior' ? 'Mês ant.' : 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-green-600" />
            <p className="text-xs text-gray-500">Recebido</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatMoeda(totalRecebido)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{pagsFiltrados.length} pagamentos</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={15} className="text-blue-500" />
            <p className="text-xs text-gray-500">A receber</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{formatMoeda(aReceberPedidos)}</p>
          <p className="text-xs text-gray-400 mt-0.5">saldos em aberto</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={15} className="text-red-500" />
            <p className="text-xs text-gray-500">A pagar</p>
          </div>
          <p className="text-2xl font-bold text-red-700">{formatMoeda(totalAPagar)}</p>
          {contasAtrasadas.length > 0 && (
            <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
              <AlertTriangle size={10} /> {contasAtrasadas.length} atrasada(s)
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E87820]/20 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag size={15} className="text-[#E87820]" />
            <p className="text-xs text-gray-500">Pedidos no período</p>
          </div>
          <p className="text-2xl font-bold text-[#2D2D2D]">{pedidosPeriodo.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatMoeda(pedidosPeriodo.reduce((s, p) => s + p.valorTotal, 0))}</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b">
        {abas.map(a => (
          <button key={a.key} onClick={() => setAba(a.key)}
            className={cn('px-4 py-2.5 text-sm font-medium transition-colors',
              aba === a.key
                ? 'text-[#2D2D2D] border-b-2 border-[#E87820]'
                : 'text-gray-500 hover:text-gray-700'
            )}>
            {a.label}
          </button>
        ))}
      </div>

      {/* ─── ABA: Visão Geral ─── */}
      {aba === 'visao_geral' && (
        <div className="space-y-5">
          {/* Alerta atrasados */}
          {contasAtrasadas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Contas atrasadas!</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {contasAtrasadas.map(c => `${c.descricao} (${formatMoeda(c.valor)})`).join(' · ')}
                </p>
              </div>
            </div>
          )}

          {/* Por categoria */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <Filter size={14} />
              Gastos por categoria
            </h2>
            <div className="space-y-2">
              {porCategoria.map(c => (
                <div key={c.cat} className="flex items-center gap-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full w-24 text-center font-medium capitalize', categoriaCor[c.cat] ?? 'bg-gray-100 text-gray-600')}>
                    {c.cat}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#E87820] h-2 rounded-full"
                      style={{ width: `${Math.min(100, ((c.total + c.pendente) / (totalAPagar + totalPago || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-28 text-right">{formatMoeda(c.total + c.pendente)}</span>
                  {c.pendente > 0 && <span className="text-xs text-red-500">({formatMoeda(c.pendente)} pendente)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Previsão instalações */}
          {recebimentosPrevistos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-700 text-sm mb-4 flex items-center gap-2">
                <Clock size={14} />
                Recebimentos previstos — próximas instalações
              </h2>
              <div className="space-y-2">
                {recebimentosPrevistos.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm px-4 py-2.5 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24">{formatData(item.data)}</span>
                      <span className="text-gray-700">{item.cliente}</span>
                      {item.maquininha && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">💳 levar maquininha</span>
                      )}
                    </div>
                    <span className="font-bold text-green-700">{formatMoeda(item.valor)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm px-4 py-2.5 bg-[#2D2D2D] rounded-lg">
                  <span className="text-white font-medium">Total previsto</span>
                  <span className="font-bold text-[#E87820]">{formatMoeda(recebimentosPrevistos.reduce((s, i) => s + i.valor, 0))}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── ABA: A Receber ─── */}
      {aba === 'receber' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 text-sm">Saldos pendentes de clientes</h2>
            <span className="text-sm font-bold text-green-700">{formatMoeda(aReceberPedidos)}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {pedidos.filter(p => p.valorRestante > 0 && p.status !== 'cancelado').map(p => {
              const inst = instalacoes.find(i => i.pedidoId === p.id)
              return (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-800">{p.leadNome}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', corStatusPedido(p.status))}>
                        {labelStatusPedido(p.status)}
                      </span>
                      <span className="text-xs text-gray-400">{p.numeroPedido}</span>
                      {inst?.dataAgendada && (
                        <span className="text-xs text-gray-400">· Inst: {formatData(new Date(inst.dataAgendada))}</span>
                      )}
                      {inst?.levaMaquininha && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">💳 maquininha</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-700">{formatMoeda(p.valorRestante)}</p>
                    <p className="text-xs text-gray-400">{p.formaPagamentoFinal ?? '—'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── ABA: A Pagar ─── */}
      {aba === 'pagar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {(['todos', ...categorias] as const).map(cat => (
                <button key={cat} onClick={() => setFiltroCat(cat)}
                  className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors capitalize',
                    filtroCat === cat ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}>
                  {cat === 'todos' ? 'Todos' : cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setAdicionandoConta(true)}
              className="flex items-center gap-1.5 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-xs font-medium px-3 py-2 rounded-lg"
            >
              <Plus size={13} />
              Nova saída
            </button>
          </div>

          {/* Formulário nova conta */}
          {adicionandoConta && (
            <div className="bg-white rounded-xl border border-[#E87820]/30 shadow-sm p-5 space-y-3">
              <p className="font-semibold text-gray-800 text-sm">Lançar saída</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Descrição</label>
                  <input value={novaConta.descricao ?? ''}
                    onChange={e => setNovaConta(f => ({ ...f, descricao: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ex: Compra de tecido blackout" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Valor (R$)</label>
                  <input type="number" step="0.01" value={novaConta.valor ?? ''}
                    onChange={e => setNovaConta(f => ({ ...f, valor: Number(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
                  <select value={novaConta.categoria ?? 'outros'}
                    onChange={e => setNovaConta(f => ({ ...f, categoria: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    {categorias.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Vencimento</label>
                  <input type="date" value={novaConta.dataVencimento instanceof Date
                    ? novaConta.dataVencimento.toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]}
                    onChange={e => setNovaConta(f => ({ ...f, dataVencimento: new Date(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Fornecedor</label>
                  <input value={novaConta.fornecedor ?? ''}
                    onChange={e => setNovaConta(f => ({ ...f, fornecedor: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAdicionandoConta(false)}
                  className="flex items-center gap-1.5 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
                  <X size={14} /> Cancelar
                </button>
                <button onClick={salvarNovaConta}
                  className="flex items-center gap-1.5 bg-[#E87820] hover:bg-[#C96A10] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  <Save size={14} /> Lançar saída
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {contasFiltradasPagar.map(c => (
                <div key={c.id} className={cn('px-5 py-3 flex items-center justify-between gap-3', c.status === 'atrasado' && 'bg-red-50/40')}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-gray-800">{c.descricao}</p>
                      {c.status === 'atrasado' && <AlertTriangle size={13} className="text-red-500" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {c.fornecedor && <span className="text-xs text-gray-400">{c.fornecedor}</span>}
                      <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', categoriaCor[c.categoria] ?? 'bg-gray-100 text-gray-600')}>
                        {c.categoria}
                      </span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full',
                        c.status === 'pago' ? 'bg-green-100 text-green-700' :
                        c.status === 'atrasado' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {c.status === 'pago' ? `Pago em ${c.dataPagamento ? formatData(new Date(c.dataPagamento)) : '—'}` :
                         c.status === 'atrasado' ? 'Atrasado' :
                         `Vence ${formatData(new Date(c.dataVencimento))}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className={cn('font-bold text-sm', c.status === 'pago' ? 'text-gray-400 line-through' : 'text-red-700')}>
                      {formatMoeda(c.valor)}
                    </p>
                    {c.status !== 'pago' && (
                      <button onClick={() => marcarPago(c)}
                        className="flex items-center gap-1 text-xs bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 px-2.5 py-1.5 rounded-lg">
                        <CheckCircle size={12} />
                        Pago
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ABA: Lançamentos ─── */}
      {aba === 'lancamentos' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <Upload size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Upload de extrato bancário</p>
              <p className="text-xs text-amber-700 mt-1">
                Em breve: importe o extrato do seu banco (OFX/CSV) e o sistema classificará automaticamente cada lançamento por categoria.
              </p>
              <button className="mt-3 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                <Upload size={13} />
                Selecionar arquivo de extrato
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <FileText size={14} />
                Pagamentos confirmados
              </h2>
              <span className="text-sm font-bold text-green-700">{formatMoeda(totalRecebido)}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {pagamentos.filter(p => p.confirmado).map(pg => (
                <div key={pg.id} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{pg.clienteNome}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{formatData(new Date(pg.dataPagamento))}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{pg.forma}</span>
                      <span className="text-xs text-gray-400">{pg.tipo === 'entrada' ? '↘ Sinal' : '↘ Saldo'}</span>
                    </div>
                  </div>
                  <p className="font-bold text-green-700">{formatMoeda(pg.valor)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
