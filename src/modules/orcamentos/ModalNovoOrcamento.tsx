import { useState, useEffect } from 'react'
import type { Orcamento, TipoProduto, Lead } from '@/types'
import { X, Calculator } from 'lucide-react'
import { formatMoeda } from '@/lib/utils'
import { mockLeads } from '@/lib/mockData'

interface Props {
  onClose: () => void
  onSalvar: (orcamento: Orcamento) => void
  leadPreSelecionado?: Lead
}

const tecidosPorProduto: Record<TipoProduto, string[]> = {
  persiana: ['Double Vision', 'Blackout', 'Solar Screen', 'Wave', 'Horizontal'],
  rolo: ['Blackout', 'Solar Screen', 'Translúcido', 'Tela Solar'],
  cortina: ['Linho', 'Veludo', 'Blackout Duplex', 'Voil', 'Seda', 'Oxford'],
  toldo: ['Acrílico 100%', 'Seda', 'Listrado', 'Preto'],
  papel_de_parede: ['Vinílico Texturizado', 'Não tecido', 'Lavável', '3D'],
}

const modelosPorProduto: Record<TipoProduto, string[]> = {
  persiana: ['Standard', 'Motorizado', 'Com cordão', 'Dupla'],
  rolo: ['Blackout Total', 'Com bandô', 'Motorizado', 'Standard'],
  cortina: ['Com forro', 'Sem forro', 'Blackout', 'Dupla'],
  toldo: ['Articulado', 'Fixo', 'Retrátil', 'Pergolado'],
  papel_de_parede: ['Premium', 'Standard', 'Geométrico', 'Floral'],
}

// Preço base sugerido por m² por tipo de produto
const precoBasePorProduto: Record<TipoProduto, number> = {
  persiana: 185,
  rolo: 168,
  cortina: 210,
  toldo: 220,
  papel_de_parede: 145,
}

export function ModalNovoOrcamento({ onClose, onSalvar, leadPreSelecionado }: Props) {
  const leadsDisponiveis = mockLeads.filter(l =>
    ['em_contato', 'orcamento_enviado', 'aguardando', 'convertido'].includes(l.status)
  )

  const [form, setForm] = useState({
    leadId: leadPreSelecionado?.id ?? '',
    leadNomeManual: '',
    usarLeadManual: !leadPreSelecionado,
    tipoProduto: (leadPreSelecionado?.produto ?? 'persiana') as TipoProduto,
    ambiente: leadPreSelecionado?.ambiente ?? '',
    largura: leadPreSelecionado?.largura?.toString() ?? '',
    altura: leadPreSelecionado?.altura?.toString() ?? '',
    tecido: leadPreSelecionado?.tecido ?? '',
    cor: leadPreSelecionado?.cor ?? '',
    modelo: '',
    precoM2: precoBasePorProduto[leadPreSelecionado?.produto ?? 'persiana'].toString(),
    valorInstalacao: '150',
    desconto: '0',
    prazoEntrega: '7',
    observacoes: '',
  })

  const [metros, setMetros] = useState(0)
  const [valorProduto, setValorProduto] = useState(0)
  const [valorFinal, setValorFinal] = useState(0)

  // Recalcula tudo que muda nos campos numéricos
  useEffect(() => {
    const larg = parseFloat(form.largura) || 0
    const alt = parseFloat(form.altura) || 0
    const m2 = parseFloat((larg * alt).toFixed(2))
    const preco = parseFloat(form.precoM2) || 0
    const inst = parseFloat(form.valorInstalacao) || 0
    const desc = parseFloat(form.desconto) || 0

    const produto = m2 * preco
    const subtotal = produto + inst
    const final = subtotal * (1 - desc / 100)

    setMetros(m2)
    setValorProduto(produto)
    setValorFinal(parseFloat(final.toFixed(2)))
  }, [form.largura, form.altura, form.precoM2, form.valorInstalacao, form.desconto])

  // Ao trocar produto, ajusta preço sugerido e limpa tecido/modelo
  function setTipoProduto(tipo: TipoProduto) {
    setForm(prev => ({
      ...prev,
      tipoProduto: tipo,
      precoM2: precoBasePorProduto[tipo].toString(),
      tecido: '',
      modelo: '',
    }))
  }

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function leadSelecionado(): Lead | undefined {
    return leadsDisponiveis.find(l => l.id === form.leadId)
  }

  function nomeCliente(): string {
    if (form.usarLeadManual) return form.leadNomeManual
    return leadSelecionado()?.nome ?? ''
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault()
    const numero = `ORC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
    const orcamento: Orcamento = {
      id: `orc-${Date.now()}`,
      leadId: form.leadId || 'manual',
      leadNome: nomeCliente(),
      numeroOrcamento: numero,
      tipoProduto: form.tipoProduto,
      ambiente: form.ambiente || undefined,
      largura: parseFloat(form.largura) || 0,
      altura: parseFloat(form.altura) || 0,
      metros,
      tecido: form.tecido || undefined,
      cor: form.cor || undefined,
      modelo: form.modelo || undefined,
      precoM2: parseFloat(form.precoM2) || 0,
      valorProduto,
      valorInstalacao: parseFloat(form.valorInstalacao) || 0,
      desconto: parseFloat(form.desconto) || 0,
      valorFinal,
      prazoEntrega: parseInt(form.prazoEntrega) || 7,
      status: 'rascunho',
      criadoEm: new Date(),
    }
    onSalvar(orcamento)
  }

  const input = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent'
  const label = 'block text-xs font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">Novo Orçamento</h2>
            <p className="text-xs text-gray-400 mt-0.5">Preencha os dados para gerar o orçamento</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={salvar} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">

            {/* Cliente */}
            <section>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cliente</p>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    checked={!form.usarLeadManual}
                    onChange={() => set('usarLeadManual', 'false')}
                    className="accent-[#2D2D2D]"
                  />
                  Selecionar do CRM
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    checked={form.usarLeadManual}
                    onChange={() => set('usarLeadManual', 'true')}
                    className="accent-[#2D2D2D]"
                  />
                  Digitar nome
                </label>
              </div>

              {!form.usarLeadManual ? (
                <div>
                  <label className={label}>Lead do CRM *</label>
                  <select
                    className={input}
                    required={!form.usarLeadManual}
                    value={form.leadId}
                    onChange={e => {
                      const lead = leadsDisponiveis.find(l => l.id === e.target.value)
                      if (lead) {
                        setForm(prev => ({
                          ...prev,
                          leadId: lead.id,
                          tipoProduto: lead.produto,
                          ambiente: lead.ambiente ?? prev.ambiente,
                          largura: lead.largura?.toString() ?? prev.largura,
                          altura: lead.altura?.toString() ?? prev.altura,
                          tecido: lead.tecido ?? prev.tecido,
                          cor: lead.cor ?? prev.cor,
                          precoM2: precoBasePorProduto[lead.produto].toString(),
                        }))
                      } else {
                        set('leadId', e.target.value)
                      }
                    }}
                  >
                    <option value="">Selecionar lead...</option>
                    {leadsDisponiveis.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.nome} — {l.produto === 'papel_de_parede' ? 'Papel de Parede' : l.produto.charAt(0).toUpperCase() + l.produto.slice(1)} ({l.cidade})
                      </option>
                    ))}
                  </select>
                  {leadSelecionado() && (
                    <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                      📞 {leadSelecionado()!.telefone} · 📍 {leadSelecionado()!.cidade}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className={label}>Nome do cliente *</label>
                  <input
                    className={input}
                    required={form.usarLeadManual}
                    value={form.leadNomeManual}
                    onChange={e => set('leadNomeManual', e.target.value)}
                    placeholder="Nome completo do cliente"
                  />
                </div>
              )}
            </section>

            {/* Produto */}
            <section className="border-t pt-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Produto</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Tipo de produto *</label>
                  <select
                    className={input}
                    value={form.tipoProduto}
                    onChange={e => setTipoProduto(e.target.value as TipoProduto)}
                  >
                    <option value="persiana">Persiana</option>
                    <option value="rolo">Rolo</option>
                    <option value="cortina">Cortina</option>
                    <option value="toldo">Toldo</option>
                    <option value="papel_de_parede">Papel de Parede</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Ambiente</label>
                  <select className={input} value={form.ambiente} onChange={e => set('ambiente', e.target.value)}>
                    <option value="">Selecionar...</option>
                    <option>Dormitório</option>
                    <option>Sala</option>
                    <option>Escritório</option>
                    <option>Comercial</option>
                    <option>Varanda</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Tecido</label>
                  <select className={input} value={form.tecido} onChange={e => set('tecido', e.target.value)}>
                    <option value="">Selecionar...</option>
                    {tecidosPorProduto[form.tipoProduto].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Modelo</label>
                  <select className={input} value={form.modelo} onChange={e => set('modelo', e.target.value)}>
                    <option value="">Selecionar...</option>
                    {modelosPorProduto[form.tipoProduto].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Cor</label>
                  <input
                    className={input}
                    value={form.cor}
                    onChange={e => set('cor', e.target.value)}
                    placeholder="Ex: Branco, Bege, Cinza..."
                  />
                </div>
                <div>
                  <label className={label}>Prazo de entrega (dias úteis)</label>
                  <input
                    className={input}
                    type="number"
                    min="1"
                    value={form.prazoEntrega}
                    onChange={e => set('prazoEntrega', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Medidas */}
            <section className="border-t pt-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Medidas</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={label}>Largura (metros) *</label>
                  <input
                    className={input}
                    required
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={form.largura}
                    onChange={e => set('largura', e.target.value)}
                    placeholder="Ex: 1.50"
                  />
                </div>
                <div>
                  <label className={label}>Altura (metros) *</label>
                  <input
                    className={input}
                    required
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={form.altura}
                    onChange={e => set('altura', e.target.value)}
                    placeholder="Ex: 2.00"
                  />
                </div>
                <div>
                  <label className={label}>Área (m²)</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#2D2D2D]">
                    {metros > 0 ? `${metros.toFixed(2)} m²` : '—'}
                  </div>
                </div>
              </div>
            </section>

            {/* Preços */}
            <section className="border-t pt-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Calculator size={13} />
                Valores
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Preço por m² (R$) *</label>
                  <input
                    className={input}
                    required
                    type="number"
                    step="0.01"
                    min="1"
                    value={form.precoM2}
                    onChange={e => set('precoM2', e.target.value)}
                  />
                </div>
                <div>
                  <label className={label}>Valor instalação (R$)</label>
                  <input
                    className={input}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.valorInstalacao}
                    onChange={e => set('valorInstalacao', e.target.value)}
                  />
                </div>
                <div>
                  <label className={label}>Desconto (%)</label>
                  <input
                    className={input}
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={form.desconto}
                    onChange={e => set('desconto', e.target.value)}
                  />
                </div>
              </div>

              {/* Resumo de valores */}
              {metros > 0 && (
                <div className="mt-4 bg-[#2D2D2D]/5 border border-[#2D2D2D]/20 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{metros.toFixed(2)} m² × {formatMoeda(parseFloat(form.precoM2) || 0)}/m²</span>
                    <span className="font-medium">{formatMoeda(valorProduto)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Instalação</span>
                    <span className="font-medium">{formatMoeda(parseFloat(form.valorInstalacao) || 0)}</span>
                  </div>
                  {parseFloat(form.desconto) > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Desconto ({form.desconto}%)</span>
                      <span className="font-medium">- {formatMoeda((valorProduto + (parseFloat(form.valorInstalacao) || 0)) * (parseFloat(form.desconto) / 100))}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[#2D2D2D]/20">
                    <span className="font-bold text-[#2D2D2D]">Total</span>
                    <span className="font-bold text-xl text-[#2D2D2D]">{formatMoeda(valorFinal)}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Observações */}
            <section className="border-t pt-5">
              <label className={label}>Observações</label>
              <textarea
                className={input}
                rows={2}
                value={form.observacoes}
                onChange={e => set('observacoes', e.target.value)}
                placeholder="Condições especiais, referências, notas internas..."
              />
            </section>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button
            onClick={e => {
              const form_el = (e.target as HTMLButtonElement).closest('.flex')?.previousElementSibling?.querySelector('form') as HTMLFormElement
              form_el?.requestSubmit()
            }}
            className="flex-1 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            Salvar como Rascunho
          </button>
          <button
            onClick={e => {
              const self = e.target as HTMLButtonElement
              const form_el = self.closest('.flex')?.previousElementSibling?.querySelector('form') as HTMLFormElement
              if (form_el?.checkValidity()) {
                const numero = `ORC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
                const leadNome = form.usarLeadManual ? form.leadNomeManual : (leadsDisponiveis.find(l => l.id === form.leadId)?.nome ?? '')
                if (!leadNome) { alert('Informe o cliente'); return }
                if (!form.largura || !form.altura) { alert('Informe as medidas'); return }
                const orc: Orcamento = {
                  id: `orc-${Date.now()}`,
                  leadId: form.leadId || 'manual',
                  leadNome,
                  numeroOrcamento: numero,
                  tipoProduto: form.tipoProduto,
                  ambiente: form.ambiente || undefined,
                  largura: parseFloat(form.largura),
                  altura: parseFloat(form.altura),
                  metros,
                  tecido: form.tecido || undefined,
                  cor: form.cor || undefined,
                  modelo: form.modelo || undefined,
                  precoM2: parseFloat(form.precoM2),
                  valorProduto,
                  valorInstalacao: parseFloat(form.valorInstalacao) || 0,
                  desconto: parseFloat(form.desconto) || 0,
                  valorFinal,
                  prazoEntrega: parseInt(form.prazoEntrega) || 7,
                  status: 'enviado',
                  criadoEm: new Date(),
                }
                onSalvar(orc)
              } else {
                form_el?.reportValidity()
              }
            }}
            className="flex-1 bg-[#E87820] hover:bg-[#C96A10] text-[#2D2D2D] text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            📱 Salvar e Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
