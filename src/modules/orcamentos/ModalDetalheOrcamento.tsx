import type { Orcamento, StatusOrcamento } from '@/types'
import { X, Copy, MessageCircle, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { formatMoeda, formatData, nomeProduto } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  orcamento: Orcamento
  onClose: () => void
  onAtualizarStatus: (id: string, status: StatusOrcamento) => void
  onConverterPedido: (orcamento: Orcamento) => void
}

function LinhaDetalhe({ label, valor }: { label: string; valor: string | number | undefined }) {
  if (!valor) return null
  return (
    <div className="flex justify-between py-2 border-b border-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{valor}</span>
    </div>
  )
}

const statusConfig: Record<StatusOrcamento, { label: string; cor: string; icone: React.ReactNode }> = {
  rascunho: { label: 'Rascunho', cor: 'bg-gray-100 text-gray-600', icone: <Clock size={13} /> },
  enviado: { label: 'Enviado', cor: 'bg-blue-100 text-blue-700', icone: <MessageCircle size={13} /> },
  aprovado: { label: 'Aprovado', cor: 'bg-green-100 text-green-700', icone: <CheckCircle size={13} /> },
  recusado: { label: 'Recusado', cor: 'bg-red-100 text-red-700', icone: <XCircle size={13} /> },
}

export function ModalDetalheOrcamento({ orcamento: orc, onClose, onAtualizarStatus, onConverterPedido }: Props) {
  const cfg = statusConfig[orc.status]

  function gerarMensagemWhatsApp(): string {
    const produto = nomeProduto(orc.tipoProduto)
    const tecido = orc.tecido ? `${orc.tecido}` : ''
    const cor = orc.cor ? ` — ${orc.cor}` : ''
    const modelo = orc.modelo ? ` (${orc.modelo})` : ''
    const ambiente = orc.ambiente ? ` para ${orc.ambiente}` : ''
    const medidas = `${orc.largura}m × ${orc.altura}m`

    return encodeURIComponent(
      `Olá ${orc.leadNome}! 😊\n\n` +
      `Segue o seu orçamento da *Guimel Decor*:\n\n` +
      `📋 *${orc.numeroOrcamento}*\n` +
      `🪟 *${produto}${ambiente}*\n` +
      `${tecido ? `Tecido: ${tecido}${cor}${modelo}\n` : ''}` +
      `📐 Medidas: ${medidas} (${orc.metros.toFixed(2)} m²)\n\n` +
      `💰 *Valores:*\n` +
      `• Produto: ${formatMoeda(orc.valorProduto)}\n` +
      `• Instalação: ${formatMoeda(orc.valorInstalacao)}\n` +
      (orc.desconto > 0 ? `• Desconto: ${orc.desconto}%\n` : '') +
      `• *Total: ${formatMoeda(orc.valorFinal)}*\n\n` +
      `⏱️ Prazo de entrega: ${orc.prazoEntrega} dias úteis após aprovação\n\n` +
      `Para aprovar, é só responder aqui! 🙏`
    )
  }

  function abrirWhatsApp() {
    const lead = { telefone: '' }
    const mensagem = gerarMensagemWhatsApp()
    window.open(`https://wa.me/?text=${mensagem}`, '_blank')
  }

  function copiarTexto() {
    const produto = nomeProduto(orc.tipoProduto)
    const tecido = orc.tecido ? `Tecido: ${orc.tecido}${orc.cor ? ` — ${orc.cor}` : ''}${orc.modelo ? ` (${orc.modelo})` : ''}\n` : ''
    const texto =
      `ORÇAMENTO ${orc.numeroOrcamento}\n` +
      `Cliente: ${orc.leadNome}\n` +
      `Produto: ${produto}${orc.ambiente ? ` — ${orc.ambiente}` : ''}\n` +
      `${tecido}` +
      `Medidas: ${orc.largura}m × ${orc.altura}m (${orc.metros.toFixed(2)} m²)\n\n` +
      `Produto: ${formatMoeda(orc.valorProduto)}\n` +
      `Instalação: ${formatMoeda(orc.valorInstalacao)}\n` +
      (orc.desconto > 0 ? `Desconto: ${orc.desconto}%\n` : '') +
      `TOTAL: ${formatMoeda(orc.valorFinal)}\n\n` +
      `Prazo: ${orc.prazoEntrega} dias úteis`
    navigator.clipboard.writeText(texto)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2D2D2D]/10 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-[#2D2D2D]" />
            </div>
            <div>
              <p className="font-mono text-xs text-gray-400">{orc.numeroOrcamento}</p>
              <p className="font-bold text-gray-900 leading-tight">{orc.leadNome}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium', cfg.cor)}>
              {cfg.icone}
              {cfg.label}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg ml-1">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Produto */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Produto</p>
            <div className="bg-gray-50 rounded-xl px-4 py-1">
              <LinhaDetalhe label="Tipo" valor={nomeProduto(orc.tipoProduto)} />
              <LinhaDetalhe label="Ambiente" valor={orc.ambiente} />
              <LinhaDetalhe label="Tecido" valor={orc.tecido} />
              <LinhaDetalhe label="Cor" valor={orc.cor} />
              <LinhaDetalhe label="Modelo" valor={orc.modelo} />
            </div>
          </section>

          {/* Medidas */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Medidas</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Largura</p>
                <p className="font-bold text-gray-800 mt-0.5">{orc.largura}m</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Altura</p>
                <p className="font-bold text-gray-800 mt-0.5">{orc.altura}m</p>
              </div>
              <div className="bg-[#2D2D2D]/5 border border-[#2D2D2D]/20 rounded-xl p-3 text-center">
                <p className="text-xs text-[#2D2D2D]/70">Área</p>
                <p className="font-bold text-[#2D2D2D] mt-0.5">{orc.metros.toFixed(2)} m²</p>
              </div>
            </div>
          </section>

          {/* Valores */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Valores</p>
            <div className="bg-gray-50 rounded-xl px-4 py-1">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">
                  Produto ({orc.metros.toFixed(2)} m² × {formatMoeda(orc.precoM2)}/m²)
                </span>
                <span className="text-sm font-medium text-gray-800">{formatMoeda(orc.valorProduto)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Instalação</span>
                <span className="text-sm font-medium text-gray-800">{formatMoeda(orc.valorInstalacao)}</span>
              </div>
              {orc.desconto > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-green-600">Desconto ({orc.desconto}%)</span>
                  <span className="text-sm font-medium text-green-600">
                    - {formatMoeda((orc.valorProduto + orc.valorInstalacao) * (orc.desconto / 100))}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-3">
                <span className="font-bold text-[#2D2D2D]">Total</span>
                <span className="font-bold text-2xl text-[#2D2D2D]">{formatMoeda(orc.valorFinal)}</span>
              </div>
            </div>
          </section>

          {/* Info */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Informações</p>
            <div className="bg-gray-50 rounded-xl px-4 py-1">
              <LinhaDetalhe label="Prazo de entrega" valor={`${orc.prazoEntrega} dias úteis`} />
              <LinhaDetalhe label="Criado em" valor={formatData(new Date(orc.criadoEm))} />
              {orc.imagemSimulacaoUrl && (
                <div className="py-2">
                  <img src={orc.imagemSimulacaoUrl} alt="Simulação" className="rounded-lg w-full object-cover max-h-32" />
                </div>
              )}
            </div>
          </section>

          {/* Mudar status */}
          {orc.status !== 'aprovado' && orc.status !== 'recusado' && (
            <section>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Atualizar Status</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onAtualizarStatus(orc.id, 'aprovado')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  <CheckCircle size={15} />
                  Aprovado
                </button>
                <button
                  onClick={() => onAtualizarStatus(orc.id, 'enviado')}
                  disabled={orc.status === 'enviado'}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={15} />
                  Marcar como Enviado
                </button>
                <button
                  onClick={() => onAtualizarStatus(orc.id, 'recusado')}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium px-3 py-2.5 rounded-xl transition-colors"
                >
                  <XCircle size={15} />
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 shrink-0 space-y-2">
          {/* Botões de compartilhamento */}
          <div className="flex gap-2">
            <button
              onClick={copiarTexto}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 text-gray-600 text-sm py-2.5 rounded-xl transition-colors"
            >
              <Copy size={15} />
              Copiar texto
            </button>
            <button
              onClick={abrirWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={15} />
              Enviar WhatsApp
            </button>
          </div>

          {/* Converter em pedido */}
          {orc.status === 'aprovado' && (
            <button
              onClick={() => onConverterPedido(orc)}
              className="w-full bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              ✅ Converter em Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
