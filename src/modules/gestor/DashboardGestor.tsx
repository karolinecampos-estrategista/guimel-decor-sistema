import { mockLeads, mockPedidos, mockOrdens, mockContasPagar, mockIntalacoes, mockPagamentos } from '@/lib/mockData'
import { formatMoeda, formatData, nomeProduto, corStatusPedido, labelStatusPedido } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { addDays, isToday, isTomorrow, isWithinInterval, subDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, TrendingUp, Package, Wrench, DollarSign, Users, Calendar, ChevronRight, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const hoje = new Date()
const proximos7 = addDays(hoje, 7)

function CardKPI({ label, valor, sub, cor, icon, onClick }: { label: string; valor: string | number; sub?: string; cor: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn('bg-white rounded-xl p-5 text-left shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-full', onClick && 'cursor-pointer')}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${cor}`}>{valor}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${cor === 'text-[#2D2D2D]' ? 'bg-green-50' : cor === 'text-blue-600' ? 'bg-blue-50' : cor === 'text-orange-600' ? 'bg-orange-50' : 'bg-yellow-50'}`}>
          {icon}
        </div>
      </div>
    </button>
  )
}

export function DashboardGestor() {
  const navigate = useNavigate()

  const leadsHoje = mockLeads.filter(l => isToday(new Date(l.dataContato))).length
  const pedidosAtivos = mockPedidos.filter(p => !['concluido', 'cancelado'].includes(p.status)).length
  const emProducao = mockOrdens.filter(o => o.status === 'em_andamento').length
  const receitaMes = mockPagamentos.filter(p => p.confirmado).reduce((s, p) => s + p.valor, 0)

  // Alertas
  const alertas: { tipo: 'erro' | 'aviso' | 'ok'; msg: string; link: string }[] = []

  const ordensAtrasadas = mockOrdens.filter(o => o.prazoProducao < hoje && o.status !== 'pronto' && o.status !== 'retirado')
  if (ordensAtrasadas.length > 0) alertas.push({ tipo: 'erro', msg: `${ordensAtrasadas.length} ordem(s) de produção com prazo vencido!`, link: '/producao' })

  const instalacoesSemPagamento = mockIntalacoes.filter(i => i.status === 'realizada' && !i.pagoAoInstalador)
  if (instalacoesSemPagamento.length > 0) alertas.push({ tipo: 'erro', msg: `${instalacoesSemPagamento.length} instalação(ões) realizadas — confirmar pagamento do cliente`, link: '/instalacoes' })

  const leadsEsquecidos = mockLeads.filter(l => l.status === 'aguardando' && (hoje.getTime() - l.dataContato.getTime()) > 5 * 86400000)
  if (leadsEsquecidos.length > 0) alertas.push({ tipo: 'aviso', msg: `${leadsEsquecidos.length} lead(s) em "Aguardando" sem contato há mais de 5 dias`, link: '/crm' })

  const contasVencendo = mockContasPagar.filter(c => c.status === 'pendente' && isWithinInterval(c.dataVencimento, { start: hoje, end: addDays(hoje, 3) }))
  if (contasVencendo.length > 0) alertas.push({ tipo: 'aviso', msg: `${contasVencendo.length} conta(s) a pagar vencendo nos próximos 3 dias`, link: '/financeiro' })

  const prontos = mockOrdens.filter(o => o.status === 'pronto').length
  if (prontos > 0) alertas.push({ tipo: 'ok', msg: `${prontos} pedido(s) pronto(s) para agendar instalação`, link: '/pedidos' })

  // Próximos eventos
  const instalacoesProximas = mockIntalacoes
    .filter(i => isWithinInterval(new Date(i.dataAgendada), { start: subDays(hoje, 1), end: proximos7 }))
    .sort((a, b) => new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime())

  const contasProximas = mockContasPagar
    .filter(c => c.status === 'pendente' && isWithinInterval(c.dataVencimento, { start: hoje, end: proximos7 }))
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())

  // Gráfico leads vs conversões
  const diasGrafico = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(hoje, 6 - i)
    return {
      dia: format(d, 'EEE', { locale: ptBR }),
      leads: mockLeads.filter(l => format(l.dataContato, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length,
      conversoes: mockLeads.filter(l => l.status === 'convertido' && format(l.dataContato, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length,
    }
  })

  // Resumo financeiro próximos 7 dias
  const aReceberProximos = mockIntalacoes
    .filter(i => isWithinInterval(new Date(i.dataAgendada), { start: hoje, end: proximos7 }))
    .reduce((s, i) => {
      const pedido = mockPedidos.find(p => p.id === i.pedidoId)
      return s + (pedido?.valorRestante ?? 0)
    }, 0)

  const aPagarProximos = mockContasPagar
    .filter(c => c.status === 'pendente' && isWithinInterval(c.dataVencimento, { start: hoje, end: proximos7 }))
    .reduce((s, c) => s + c.valor, 0)

  const statusOrdens = [
    { label: 'Pendente', count: mockOrdens.filter(o => o.status === 'pendente').length, cor: 'bg-yellow-100 text-yellow-800' },
    { label: 'Em Produção', count: mockOrdens.filter(o => o.status === 'em_andamento').length, cor: 'bg-blue-100 text-blue-800' },
    { label: 'Pronto', count: mockOrdens.filter(o => o.status === 'pronto').length, cor: 'bg-green-100 text-green-800' },
    { label: 'Retirado', count: mockOrdens.filter(o => o.status === 'retirado').length, cor: 'bg-gray-100 text-gray-600' },
  ]

  function diaLabel(data: Date): string {
    if (isToday(data)) return 'Hoje'
    if (isTomorrow(data)) return 'Amanhã'
    return format(data, "EEE dd/MM", { locale: ptBR })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bom dia, Karoline! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">
          {format(hoje, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })} · {pedidosAtivos} pedidos ativos
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CardKPI label="Leads Hoje" valor={leadsHoje} sub="novos contatos no WhatsApp" cor="text-[#2D2D2D]" icon={<Users size={20} className="text-[#2D2D2D]" />} onClick={() => navigate('/crm')} />
        <CardKPI label="Pedidos Ativos" valor={pedidosAtivos} sub={`${mockOrdens.filter(o => o.status === 'pendente').length} aguardando produção`} cor="text-blue-600" icon={<Package size={20} className="text-blue-600" />} onClick={() => navigate('/pedidos')} />
        <CardKPI label="Em Produção" valor={emProducao} sub={`${mockOrdens.filter(o => o.status === 'pronto').length} prontos p/ retirada`} cor="text-orange-600" icon={<Wrench size={20} className="text-orange-600" />} onClick={() => navigate('/producao')} />
        <CardKPI label="Entradas do Mês" valor={formatMoeda(receitaMes)} sub="pagamentos confirmados" cor="text-[#2D2D2D]" icon={<DollarSign size={20} className="text-[#2D2D2D]" />} onClick={() => navigate('/financeiro')} />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Atenção — Itens que precisam de ação
          </h2>
          <div className="space-y-2">
            {alertas.map((a, i) => (
              <button key={i} onClick={() => navigate(a.link)} className="w-full flex items-center gap-3 text-sm text-left hover:opacity-80 transition-opacity">
                <span className={cn('w-2 h-2 rounded-full shrink-0', a.tipo === 'erro' ? 'bg-red-500' : a.tipo === 'aviso' ? 'bg-yellow-500' : 'bg-green-500')} />
                <span className="text-gray-700 flex-1">{a.msg}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#2D2D2D]" />
            Leads vs Conversões — Últimos 7 dias
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={diasGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" name="Leads" fill="#93C5A4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversoes" name="Conversões" fill="#2D2D2D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Próximos eventos */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-[#2D2D2D]" />
            Próximos 7 Dias
          </h2>
          <div className="space-y-3 text-xs">
            {instalacoesProximas.map(i => (
              <div key={i.id} className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">🔧</span>
                <div>
                  <p className="font-medium text-gray-800">{diaLabel(new Date(i.dataAgendada))} {i.horaAgendada && `· ${i.horaAgendada}`}</p>
                  <p className="text-gray-500">{i.clienteNome} · {i.instaladorNome}</p>
                  {(() => {
                    const p = mockPedidos.find(p => p.id === i.pedidoId)
                    return p?.valorRestante ? <p className="text-green-700">Receber: {formatMoeda(p.valorRestante)}</p> : null
                  })()}
                </div>
              </div>
            ))}
            {contasProximas.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">💸</span>
                <div>
                  <p className="font-medium text-gray-800">{diaLabel(new Date(c.dataVencimento))}</p>
                  <p className="text-gray-500">{c.descricao}</p>
                  <p className="text-red-600">{formatMoeda(c.valor)}</p>
                </div>
              </div>
            ))}
            {instalacoesProximas.length === 0 && contasProximas.length === 0 && (
              <p className="text-gray-400 text-center py-4">Nenhum evento nos próximos 7 dias</p>
            )}
          </div>
        </div>
      </div>

      {/* Produção + Financeiro resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status produção */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Wrench size={16} className="text-[#2D2D2D]" />
              Produção em Tempo Real
            </h2>
            <button onClick={() => navigate('/producao')} className="text-xs text-[#2D2D2D] hover:underline flex items-center gap-1">
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {statusOrdens.map(s => (
              <div key={s.label} className={cn('rounded-lg px-3 py-3 text-center', s.cor)}>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {mockOrdens.filter(o => o.status !== 'retirado').slice(0, 3).map(o => (
              <div key={o.id} className="flex items-center gap-3 text-xs">
                <span className={cn('px-2 py-0.5 rounded-full font-medium',
                  o.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                  o.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                )}>
                  {o.status === 'pendente' ? 'Pendente' : o.status === 'em_andamento' ? 'Produzindo' : 'Pronto'}
                </span>
                <span className="text-gray-700 flex-1 truncate">{o.clienteNome} · {nomeProduto(o.tipoProduto)}</span>
                <span className="text-gray-400 shrink-0">até {formatData(new Date(o.prazoProducao))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign size={16} className="text-[#2D2D2D]" />
              Financeiro — Próximos 7 Dias
            </h2>
            <button onClick={() => navigate('/financeiro')} className="text-xs text-[#2D2D2D] hover:underline flex items-center gap-1">
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-700 font-medium">💚 A Receber</p>
              <p className="text-xl font-bold text-green-800 mt-1">{formatMoeda(aReceberProximos)}</p>
              <p className="text-xs text-green-600 mt-0.5">{instalacoesProximas.length} instalações</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-red-700 font-medium">🔴 A Pagar</p>
              <p className="text-xl font-bold text-red-800 mt-1">{formatMoeda(aPagarProximos)}</p>
              <p className="text-xs text-red-600 mt-0.5">{contasProximas.length} contas</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saldo projetado:</span>
              <span className={cn('font-bold', (aReceberProximos - aPagarProximos) >= 0 ? 'text-green-700' : 'text-red-700')}>
                {formatMoeda(aReceberProximos - aPagarProximos)}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {mockPedidos.filter(p => p.status !== 'concluido' && p.valorRestante > 0).slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn('px-2 py-0.5 rounded-full', corStatusPedido(p.status))}>{labelStatusPedido(p.status)}</span>
                  <span className="text-gray-700">{p.leadNome}</span>
                </div>
                <span className="text-green-700 font-medium">{formatMoeda(p.valorRestante)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedidos recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Pedidos Recentes</h2>
          <button onClick={() => navigate('/pedidos')} className="text-xs text-[#2D2D2D] hover:underline flex items-center gap-1">
            Ver todos <ChevronRight size={12} />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3">Pedido</th>
              <th className="text-left px-5 py-3">Cliente</th>
              <th className="text-left px-5 py-3">Produto</th>
              <th className="text-left px-5 py-3">Valor</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockPedidos.slice(0, 5).map((p, i) => (
              <tr key={p.id} className={cn('border-t border-gray-50', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.numeroPedido}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{p.leadNome}</td>
                <td className="px-5 py-3 text-gray-600">{nomeProduto(p.tipoProduto)} {p.cor}</td>
                <td className="px-5 py-3 text-gray-800">{formatMoeda(p.valorTotal)}</td>
                <td className="px-5 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', corStatusPedido(p.status))}>
                    {labelStatusPedido(p.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
