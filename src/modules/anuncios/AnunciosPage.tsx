import { mockMetricas, mockLeads } from '@/lib/mockData'
import { formatMoeda, cn } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { subDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, DollarSign, MessageCircle, Target, Zap } from 'lucide-react'

const hoje = new Date()

export function AnunciosPage() {
  const totalInvest = mockMetricas.reduce((s, m) => s + m.investimento, 0)
  const totalLeads = mockMetricas.reduce((s, m) => s + m.mensagens, 0)
  const totalConversoes = mockMetricas.reduce((s, m) => s + m.conversoes, 0)
  const totalReceita = mockMetricas.reduce((s, m) => s + m.receitaGerada, 0)
  const roas = totalInvest > 0 ? (totalReceita / totalInvest).toFixed(1) : '0'
  const taxaConv = totalLeads > 0 ? ((totalConversoes / totalLeads) * 100).toFixed(1) : '0'
  const custoLead = totalLeads > 0 ? totalInvest / totalLeads : 0
  const custoVenda = totalConversoes > 0 ? totalInvest / totalConversoes : 0

  // Gráfico por campanha
  const campanhas = [...new Set(mockMetricas.map(m => m.nomeCampanha))]
  const dadosCampanha = campanhas.map(c => {
    const mets = mockMetricas.filter(m => m.nomeCampanha === c)
    const invest = mets.reduce((s, m) => s + m.investimento, 0)
    const leads = mets.reduce((s, m) => s + m.mensagens, 0)
    const conv = mets.reduce((s, m) => s + m.conversoes, 0)
    const receita = mets.reduce((s, m) => s + m.receitaGerada, 0)
    return {
      campanha: c.length > 20 ? c.slice(0, 20) + '…' : c,
      campanhaFull: c,
      invest, leads, conv, receita,
      roas: invest > 0 ? +(receita / invest).toFixed(1) : 0,
      taxa: leads > 0 ? +((conv / leads) * 100).toFixed(1) : 0,
    }
  }).sort((a, b) => b.roas - a.roas)

  // Gráfico por dia
  const dadosDia = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(hoje, 6 - i)
    const mets = mockMetricas.filter(m => format(new Date(m.data), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd'))
    return {
      dia: format(d, 'EEE', { locale: ptBR }),
      invest: mets.reduce((s, m) => s + m.investimento, 0),
      leads: mets.reduce((s, m) => s + m.mensagens, 0),
      conv: mets.reduce((s, m) => s + m.conversoes, 0),
    }
  })

  function roasCor(roas: number): string {
    if (roas >= 5) return 'bg-green-100 text-green-800'
    if (roas >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Métricas de Anúncios</h1>
        <p className="text-gray-500 text-sm mt-1">Performance das campanhas Meta Ads e TikTok Ads</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1"><DollarSign size={12} />Investimento</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatMoeda(totalInvest)}</p>
          <p className="text-xs text-gray-400 mt-1">últimos 7 dias</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1"><MessageCircle size={12} />Leads recebidos</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalLeads}</p>
          <p className="text-xs text-gray-400 mt-1">Custo/lead: {formatMoeda(custoLead)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1"><Target size={12} />Conversões</p>
          <p className="text-2xl font-bold text-[#2D2D2D] mt-1">{totalConversoes}</p>
          <p className="text-xs text-gray-400 mt-1">Taxa: {taxaConv}% · Custo: {formatMoeda(custoVenda)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-1"><Zap size={12} />ROAS</p>
          <p className="text-2xl font-bold text-[#E87820] mt-1">{roas}x</p>
          <p className="text-xs text-gray-400 mt-1">Receita: {formatMoeda(totalReceita)}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Leads vs Conversões por Dia</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" name="Leads" fill="#93C5A4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conv" name="Conversões" fill="#2D2D2D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Investimento por Dia (R$)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dadosDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatMoeda(Number(v))} />
              <Line type="monotone" dataKey="invest" name="Investimento" stroke="#E87820" strokeWidth={2} dot={{ fill: '#E87820' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela por campanha */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-semibold text-gray-700">Performance por Campanha</h2>
          <p className="text-xs text-gray-400 mt-0.5">Ordenado por ROAS (retorno sobre investimento)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Campanha</th>
                <th className="text-right px-4 py-3">Investimento</th>
                <th className="text-right px-4 py-3">Leads</th>
                <th className="text-right px-4 py-3">Conversões</th>
                <th className="text-right px-4 py-3">Taxa</th>
                <th className="text-right px-4 py-3">Receita</th>
                <th className="text-right px-4 py-3">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {dadosCampanha.map((c, i) => (
                <tr key={c.campanhaFull} className={cn('border-t border-gray-50', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30')}>
                  <td className="px-5 py-3 font-medium text-gray-800">{c.campanhaFull}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatMoeda(c.invest)}</td>
                  <td className="px-4 py-3 text-right">{c.leads}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#2D2D2D]">{c.conv}</td>
                  <td className="px-4 py-3 text-right">{c.taxa}%</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">{formatMoeda(c.receita)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', roasCor(c.roas))}>
                      {c.roas}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-[#2D2D2D] rounded-xl p-5 text-white">
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp size={16} />💡 Análise Automática</h2>
        <ul className="space-y-2 text-sm text-white/80">
          {dadosCampanha[0] && (
            <li>• <strong className="text-[#E87820]">{dadosCampanha[0].campanhaFull}</strong> tem ROAS de {dadosCampanha[0].roas}x — seu melhor anúncio agora</li>
          )}
          {dadosCampanha.find(c => c.roas < 3) && (
            <li>• <strong className="text-red-300">{dadosCampanha.find(c => c.roas < 3)?.campanhaFull}</strong> com ROAS abaixo de 3x — analise se vale continuar investindo</li>
          )}
          <li>• Taxa de conversão atual: <strong className="text-[#E87820]">{taxaConv}%</strong> dos leads recebidos viraram vendas</li>
          <li>• Custo médio por lead: <strong className="text-[#E87820]">{formatMoeda(custoLead)}</strong> · Por venda: <strong className="text-[#E87820]">{formatMoeda(custoVenda)}</strong></li>
        </ul>
      </div>
    </div>
  )
}
