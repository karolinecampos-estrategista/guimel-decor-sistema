import { mockIntalacoes, mockInstaladores, mockPedidos } from '@/lib/mockData'
import { formatData, formatMoeda, cn } from '@/lib/utils'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Phone, CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

function statusCor(status: string) {
  const m: Record<string, string> = {
    agendada: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-blue-100 text-blue-800',
    realizada: 'bg-green-100 text-green-800',
    reagendada: 'bg-orange-100 text-orange-800',
    cancelada: 'bg-red-100 text-red-800',
  }
  return m[status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string) {
  const m: Record<string, string> = {
    agendada: 'Agendada',
    confirmada: 'Confirmada',
    realizada: 'Realizada',
    reagendada: 'Reagendada',
    cancelada: 'Cancelada',
  }
  return m[status] ?? status
}

function diaLabel(data: Date): string {
  if (isToday(data)) return '📅 Hoje'
  if (isTomorrow(data)) return '📅 Amanhã'
  return format(data, "EEE, dd 'de' MMM", { locale: ptBR })
}

export function InstalacoesPage() {
  const instalacoes = [...mockIntalacoes].sort((a, b) =>
    new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime()
  )

  // Acumulado instaladores (semana)
  const acumulado = mockInstaladores.map(inst => {
    const instThisWeek = instalacoes.filter(i =>
      i.instaladorId === inst.id &&
      i.status === 'realizada' &&
      !i.pagoAoInstalador &&
      isThisWeek(new Date(i.dataAgendada))
    )
    const total = instThisWeek.reduce((s, i) => s + i.valorInstalacaoInstalador, 0)
    return { instalador: inst, instalacoes: instThisWeek, total }
  }).filter(a => a.total > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instalações</h1>
        <p className="text-gray-500 text-sm mt-1">
          {instalacoes.filter(i => i.status === 'agendada' || i.status === 'confirmada').length} agendadas ·
          {instalacoes.filter(i => isToday(new Date(i.dataAgendada))).length} hoje
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de instalações */}
        <div className="lg:col-span-2 space-y-4">
          {instalacoes.map(inst => {
            const pedido = mockPedidos.find(p => p.id === inst.pedidoId)
            return (
              <div key={inst.id} className={cn(
                'bg-white rounded-xl p-5 shadow-sm border',
                isToday(new Date(inst.dataAgendada)) ? 'border-[#2D2D2D]' : 'border-gray-100'
              )}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{diaLabel(new Date(inst.dataAgendada))} {inst.horaAgendada && `· ${inst.horaAgendada}`}</p>
                    <p className="font-bold text-gray-900 mt-0.5">{inst.clienteNome}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={11} />
                      {inst.enderecoCliente}{inst.cidade ? `, ${inst.cidade}` : ''}
                    </p>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium shrink-0', statusCor(inst.status))}>
                    {statusLabel(inst.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Instalador</p>
                    <p className="font-medium text-gray-800">{inst.instaladorNome}</p>
                    <p className="text-gray-400">Recebe: {formatMoeda(inst.valorInstalacaoInstalador)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Cobrança do cliente</p>
                    {inst.levaMaquininha && (
                      <p className="font-medium text-blue-700 flex items-center gap-1"><CreditCard size={11} /> Leva maquininha</p>
                    )}
                    {inst.formaCobranca === 'pix' && (
                      <p className="font-medium text-green-700 flex items-center gap-1"><Smartphone size={11} /> Cobrar Pix</p>
                    )}
                    {inst.formaCobranca === 'pago' && (
                      <p className="font-medium text-gray-600 flex items-center gap-1"><CheckCircle size={11} /> Já pago</p>
                    )}
                    {pedido && pedido.valorRestante > 0 && (
                      <p className="text-[#2D2D2D] font-bold mt-1">{formatMoeda(pedido.valorRestante)}</p>
                    )}
                  </div>
                </div>

                {inst.observacoes && (
                  <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-lg px-3 py-2">{inst.observacoes}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Acumulado instaladores */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm mb-4">💰 Pagamento da Semana</h2>
            {acumulado.length === 0 ? (
              <p className="text-xs text-gray-400">Nenhum pagamento pendente esta semana</p>
            ) : (
              <div className="space-y-4">
                {acumulado.map(a => (
                  <div key={a.instalador.id} className="border border-gray-100 rounded-xl p-3">
                    <p className="font-semibold text-sm text-gray-800">{a.instalador.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.instalacoes.length} instalação(ões) realizadas</p>
                    <p className="text-xl font-bold text-[#2D2D2D] mt-2">{formatMoeda(a.total)}</p>
                    {a.instalador.pixChave && (
                      <p className="text-xs text-gray-500 mt-1">Pix: {a.instalador.pixChave}</p>
                    )}
                    <button className="mt-2 w-full text-xs bg-[#E87820] hover:bg-[#b8962e] text-[#2D2D2D] font-semibold py-1.5 rounded-lg transition-colors">
                      Marcar como Pago
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instaladores cadastrados */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">Instaladores</h2>
            <div className="space-y-2">
              {mockInstaladores.map(i => (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-xs">{i.nome}</p>
                    <p className="text-xs text-gray-500">{i.telefone}</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ativo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
