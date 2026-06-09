import { useState } from 'react'
import type { Lead, StatusLead, Orcamento, StatusOrcamento } from '@/types'
import { formatMoeda, formatData, nomeProduto, labelStatusLead } from '@/lib/utils'
import { X, Phone, MessageCircle, MapPin, Plus, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModalNovoOrcamento } from '@/modules/orcamentos/ModalNovoOrcamento'
import { ModalDetalheOrcamento } from '@/modules/orcamentos/ModalDetalheOrcamento'

interface Props {
  lead: Lead
  orcamentos: Orcamento[]
  onClose: () => void
  onMover: (status: StatusLead) => void
  onCriarOrcamento: (orcamento: Orcamento) => void
  onAtualizarOrcamento: (id: string, status: StatusOrcamento) => void
  onConverterPedido: (orcamento: Orcamento) => void
}

const statusOptions: StatusLead[] = ['novo', 'em_contato', 'nao_responde', 'so_chamou', 'orcamento_enviado', 'aguardando', 'convertido', 'perdido']

const statusOrcCor: Record<StatusOrcamento, string> = {
  rascunho: 'bg-gray-100 text-gray-600',
  enviado: 'bg-blue-100 text-blue-700',
  aprovado: 'bg-green-100 text-green-700',
  recusado: 'bg-red-100 text-red-700',
}
const statusOrcLabel: Record<StatusOrcamento, string> = {
  rascunho: 'Rascunho', enviado: 'Enviado', aprovado: 'Aprovado', recusado: 'Recusado',
}

export function ModalDetalheLead({ lead, orcamentos, onClose, onMover, onCriarOrcamento, onAtualizarOrcamento, onConverterPedido }: Props) {
  const [aba, setAba] = useState<'info' | 'orcamentos'>('info')
  const [abrirNovoOrc, setAbrirNovoOrc] = useState(false)
  const [orcDetalhe, setOrcDetalhe] = useState<Orcamento | null>(null)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{lead.nome}</h2>
            <p className="text-sm text-gray-500">{lead.cidade} · {nomeProduto(lead.produto)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Status */}
        <div className="px-6 py-3 border-b bg-gray-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => onMover(s)}
                className={cn(
                  'text-xs px-3 py-1 rounded-full border transition-all',
                  lead.status === s
                    ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                    : 'border-gray-200 text-gray-600 hover:border-[#2D2D2D] hover:text-[#2D2D2D]'
                )}
              >
                {labelStatusLead(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-1 px-6 pt-3 border-b">
          {(['info', 'orcamentos'] as const).map(a => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative',
                aba === a ? 'text-[#2D2D2D] border-b-2 border-[#2D2D2D]' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {a === 'info' ? '📋 Informações' : (
                <span className="flex items-center gap-1.5">
                  📄 Orçamentos
                  {orcamentos.length > 0 && (
                    <span className="bg-[#2D2D2D] text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {orcamentos.length}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {aba === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Telefone</p>
                  <a href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                    <Phone size={14} />
                    {lead.telefone}
                  </a>
                </div>
                {lead.cidade && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cidade</p>
                    <p className="text-sm text-gray-800 flex items-center gap-1"><MapPin size={14} />{lead.cidade}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Produto Desejado</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-xs text-gray-500">Produto</p><p className="font-medium">{nomeProduto(lead.produto)}</p></div>
                  {lead.ambiente && <div><p className="text-xs text-gray-500">Ambiente</p><p className="font-medium">{lead.ambiente}</p></div>}
                  {lead.largura && <div><p className="text-xs text-gray-500">Largura</p><p className="font-medium">{lead.largura}m</p></div>}
                  {lead.altura && <div><p className="text-xs text-gray-500">Altura</p><p className="font-medium">{lead.altura}m</p></div>}
                  {lead.tecido && <div><p className="text-xs text-gray-500">Tecido</p><p className="font-medium">{lead.tecido}</p></div>}
                  {lead.cor && <div><p className="text-xs text-gray-500">Cor</p><p className="font-medium">{lead.cor}</p></div>}
                </div>
              </div>

              {lead.origemAnuncio && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Origem</p>
                  <p className="text-sm text-blue-600">📢 {lead.origemAnuncio}{lead.nomeCampanha ? ` · ${lead.nomeCampanha}` : ''}</p>
                </div>
              )}

              {lead.valorEstimado && (
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Valor Estimado</p>
                  <p className="text-xl font-bold text-green-700">{formatMoeda(lead.valorEstimado)}</p>
                </div>
              )}

              {lead.observacoes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Observações</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{lead.observacoes}</p>
                </div>
              )}
            </div>
          )}

          {aba === 'orcamentos' && (
            <div className="space-y-3">
              <button
                onClick={() => setAbrirNovoOrc(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#2D2D2D]/30 hover:border-[#2D2D2D]/60 hover:bg-[#2D2D2D]/5 text-[#2D2D2D] text-sm font-medium py-3 rounded-xl transition-all"
              >
                <Plus size={16} />
                Criar Orçamento para {lead.nome.split(' ')[0]}
              </button>

              {orcamentos.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Nenhum orçamento criado ainda</p>
              ) : (
                orcamentos.map(o => (
                  <div
                    key={o.id}
                    onClick={() => setOrcDetalhe(o)}
                    className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-[#2D2D2D]/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-xs text-gray-400">{o.numeroOrcamento}</p>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusOrcCor[o.status])}>
                        {statusOrcLabel[o.status]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{nomeProduto(o.tipoProduto)}{o.cor ? ` · ${o.cor}` : ''}</p>
                    <p className="text-xs text-gray-500">{o.largura}m × {o.altura}m{o.tecido ? ` · ${o.tecido}` : ''}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-[#2D2D2D]">{formatMoeda(o.valorFinal)}</p>
                      <div className="flex items-center gap-2">
                        {o.status === 'aprovado' && (
                          <button
                            onClick={e => { e.stopPropagation(); onConverterPedido(o) }}
                            className="flex items-center gap-1 text-xs bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            <CheckCircle size={12} />
                            Virar Pedido
                          </button>
                        )}
                        {(o.status === 'rascunho' || o.status === 'enviado') && (
                          <div className="flex gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); onAtualizarOrcamento(o.id, 'aprovado') }}
                              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-2 py-1.5 rounded-lg transition-colors"
                            >
                              ✓ Aprovado
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); onAtualizarOrcamento(o.id, 'recusado') }}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1.5 rounded-lg transition-colors"
                            >
                              <XCircle size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex gap-2 shrink-0">
          <a
            href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <button
            onClick={() => { setAba('orcamentos'); setAbrirNovoOrc(true) }}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Criar Orçamento
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de novo orçamento (aninhado) */}
      {abrirNovoOrc && (
        <ModalNovoOrcamento
          leadPreSelecionado={lead}
          onClose={() => setAbrirNovoOrc(false)}
          onSalvar={orc => {
            onCriarOrcamento(orc)
            onMover('orcamento_enviado')
            setAbrirNovoOrc(false)
          }}
        />
      )}

      {/* Modal de detalhe de orçamento (aninhado) */}
      {orcDetalhe && (
        <ModalDetalheOrcamento
          orcamento={orcDetalhe}
          onClose={() => setOrcDetalhe(null)}
          onAtualizarStatus={(id, status) => {
            onAtualizarOrcamento(id, status)
            setOrcDetalhe(prev => prev ? { ...prev, status } : null)
          }}
          onConverterPedido={orc => {
            onConverterPedido(orc)
            setOrcDetalhe(null)
          }}
        />
      )}
    </div>
  )
}
