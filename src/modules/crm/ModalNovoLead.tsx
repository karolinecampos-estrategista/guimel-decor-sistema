import { useState } from 'react'
import type { Lead, TipoProduto } from '@/types'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
  onSalvar: (lead: Lead) => void
}

export function ModalNovoLead({ onClose, onSalvar }: Props) {
  const [form, setForm] = useState({
    nome: '', telefone: '', cidade: '',
    produto: 'persiana' as TipoProduto,
    ambiente: '', largura: '', altura: '',
    tecido: '', cor: '',
    origemAnuncio: '', nomeCampanha: '', observacoes: '',
  })

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault()
    const lead: Lead = {
      id: `l-${Date.now()}`,
      nome: form.nome,
      telefone: form.telefone,
      cidade: form.cidade || undefined,
      produto: form.produto,
      ambiente: form.ambiente || undefined,
      largura: form.largura ? parseFloat(form.largura) : undefined,
      altura: form.altura ? parseFloat(form.altura) : undefined,
      tecido: form.tecido || undefined,
      cor: form.cor || undefined,
      origemAnuncio: form.origemAnuncio || undefined,
      nomeCampanha: form.nomeCampanha || undefined,
      observacoes: form.observacoes || undefined,
      status: 'novo',
      dataContato: new Date(),
    }
    onSalvar(lead)
  }

  const input = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent"
  const label = "block text-xs font-medium text-gray-700 mb-1"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-900">Novo Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={salvar} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={label}>Nome completo *</label>
              <input className={input} required value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div>
              <label className={label}>Telefone / WhatsApp *</label>
              <input className={input} required value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="11 99999-9999" />
            </div>
            <div>
              <label className={label}>Cidade</label>
              <input className={input} value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="São Paulo" />
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Produto Desejado</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Tipo de produto *</label>
                <select className={input} value={form.produto} onChange={e => set('produto', e.target.value)}>
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
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className={label}>Largura (metros)</label>
                <input className={input} type="number" step="0.01" value={form.largura} onChange={e => set('largura', e.target.value)} placeholder="1.50" />
              </div>
              <div>
                <label className={label}>Altura (metros)</label>
                <input className={input} type="number" step="0.01" value={form.altura} onChange={e => set('altura', e.target.value)} placeholder="2.00" />
              </div>
              <div>
                <label className={label}>Tecido</label>
                <input className={input} value={form.tecido} onChange={e => set('tecido', e.target.value)} placeholder="Blackout, Double Vision..." />
              </div>
              <div>
                <label className={label}>Cor</label>
                <input className={input} value={form.cor} onChange={e => set('cor', e.target.value)} placeholder="Branco, Bege..." />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Origem</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Canal</label>
                <select className={input} value={form.origemAnuncio} onChange={e => set('origemAnuncio', e.target.value)}>
                  <option value="">Selecionar...</option>
                  <option>Meta Ads</option>
                  <option>TikTok Ads</option>
                  <option>Instagram Orgânico</option>
                  <option>Indicação</option>
                  <option>Google</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label className={label}>Campanha/Anúncio</label>
                <input className={input} value={form.nomeCampanha} onChange={e => set('nomeCampanha', e.target.value)} placeholder="Nome da campanha" />
              </div>
            </div>
          </div>

          <div>
            <label className={label}>Observações</label>
            <textarea className={input} rows={3} value={form.observacoes} onChange={e => set('observacoes', e.target.value)} placeholder="Notas sobre o lead..." />
          </div>
        </form>

        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button
            onClick={e => { e.preventDefault(); const form_el = (e.target as HTMLButtonElement).closest('div')?.previousElementSibling as HTMLFormElement; form_el?.requestSubmit() }}
            className="flex-1 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Salvar Lead
          </button>
        </div>
      </div>
    </div>
  )
}
