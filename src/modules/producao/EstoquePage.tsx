import { useState } from 'react'
import { formatData, nomeProduto, cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, ShoppingCart, Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import type { ItemEstoque, TipoProduto } from '@/types'

function badgeEstoque(metragem: number) {
  if (metragem > 2) return { cor: 'bg-green-100 text-green-700', label: 'Disponível', icon: <CheckCircle size={11} /> }
  if (metragem > 0.5) return { cor: 'bg-yellow-100 text-yellow-700', label: 'Pouco estoque', icon: <AlertTriangle size={11} /> }
  return { cor: 'bg-red-100 text-red-700', label: 'Sem estoque', icon: <AlertTriangle size={11} /> }
}

const produtosOpcoes: TipoProduto[] = ['persiana', 'rolo', 'cortina', 'toldo', 'papel_de_parede']

const itemVazio: Omit<ItemEstoque, 'id' | 'atualizadoEm'> = {
  tipoMaterial: 'Tecido',
  tipoProduto: 'persiana',
  tecido: '',
  cor: '',
  largura: 250,
  metragem: 0,
  observacoes: '',
}

export function EstoquePage() {
  const { estoque, adicionarItemEstoque, atualizarEstoque, removerItemEstoque } = useDataStore()
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [adicionando, setAdicionando] = useState(false)
  const [novoItem, setNovoItem] = useState({ ...itemVazio })
  const [editForm, setEditForm] = useState<ItemEstoque | null>(null)

  const precisamCompra = estoque.filter(e => e.metragem <= 2)
  const semEstoque = estoque.filter(e => e.metragem <= 0.5)

  function iniciarEdicao(item: ItemEstoque) {
    setEditandoId(item.id)
    setEditForm({ ...item })
  }

  function salvarEdicao() {
    if (!editForm) return
    atualizarEstoque({ ...editForm, atualizadoEm: new Date() })
    setEditandoId(null)
    setEditForm(null)
  }

  function salvarNovo() {
    adicionarItemEstoque({
      id: `e-${Date.now()}`,
      ...novoItem,
      tipoProduto: novoItem.tipoProduto as TipoProduto,
      metragem: Number(novoItem.metragem),
      largura: Number(novoItem.largura),
      atualizadoEm: new Date(),
    })
    setAdicionando(false)
    setNovoItem({ ...itemVazio })
  }

  function gerarListaCompras() {
    const linhas = precisamCompra.map(e =>
      `- ${e.tecido ?? e.tipoMaterial} ${e.cor ?? ''} — ${nomeProduto(e.tipoProduto!)} — ${e.metragem}m em estoque`
    ).join('\n')
    const msg = encodeURIComponent(`Olá! Precisamos comprar os seguintes materiais:\n\n${linhas}\n\nGuimel Decor`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque de Materiais</h1>
          <p className="text-gray-500 text-sm mt-1">{estoque.length} itens · {semEstoque.length} sem estoque · {precisamCompra.length} para comprar</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {precisamCompra.length > 0 && (
            <button
              onClick={gerarListaCompras}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart size={15} />
              Lista de Compras ({precisamCompra.length})
            </button>
          )}
          <button
            onClick={() => setAdicionando(true)}
            className="flex items-center gap-2 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            Adicionar item
          </button>
        </div>
      </div>

      {/* Alertas */}
      {semEstoque.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Materiais esgotados — compra urgente!</p>
            <p className="text-xs text-red-600 mt-0.5">
              {semEstoque.map(e => `${e.tecido ?? e.tipoMaterial} ${e.cor ?? ''}`).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {precisamCompra.filter(e => e.metragem > 0.5).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <ShoppingCart size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Materiais com estoque baixo — providenciar compra</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {precisamCompra.filter(e => e.metragem > 0.5).map(e => `${e.tecido ?? e.tipoMaterial} ${e.cor ?? ''} (${e.metragem}m²)`).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Formulário novo item */}
      {adicionando && (
        <div className="bg-white rounded-xl border border-[#E87820]/30 shadow-sm p-5 space-y-3">
          <p className="font-semibold text-gray-800 text-sm">Novo item no estoque</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tipo material</label>
              <input value={novoItem.tipoMaterial}
                onChange={e => setNovoItem(f => ({ ...f, tipoMaterial: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Produto</label>
              <select value={novoItem.tipoProduto}
                onChange={e => setNovoItem(f => ({ ...f, tipoProduto: e.target.value as TipoProduto }))}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {produtosOpcoes.map(p => <option key={p} value={p}>{nomeProduto(p)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tecido</label>
              <input value={novoItem.tecido}
                onChange={e => setNovoItem(f => ({ ...f, tecido: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Cor</label>
              <input value={novoItem.cor}
                onChange={e => setNovoItem(f => ({ ...f, cor: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Largura (cm)</label>
              <input type="number" value={novoItem.largura}
                onChange={e => setNovoItem(f => ({ ...f, largura: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Metragem (m²)</label>
              <input type="number" step="0.1" value={novoItem.metragem}
                onChange={e => setNovoItem(f => ({ ...f, metragem: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Observações</label>
              <input value={novoItem.observacoes}
                onChange={e => setNovoItem(f => ({ ...f, observacoes: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setAdicionando(false)}
              className="flex items-center gap-1.5 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
              <X size={14} /> Cancelar
            </button>
            <button onClick={salvarNovo}
              className="flex items-center gap-1.5 bg-[#E87820] hover:bg-[#C96A10] text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Save size={14} /> Salvar
            </button>
          </div>
        </div>
      )}

      {/* Tabela — desktop */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block px-5 py-3 border-b bg-gray-50">
          <div className="grid grid-cols-8 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span className="col-span-2">Material / Produto</span>
            <span>Tecido</span>
            <span>Cor</span>
            <span>Largura</span>
            <span>Metragem</span>
            <span>Status</span>
            <span>Ações</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {estoque.map(item => {
            const badge = badgeEstoque(item.metragem)
            const editando = editandoId === item.id

            if (editando && editForm) {
              return (
                <div key={item.id} className="p-4 bg-blue-50/40 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={editForm.tecido ?? ''} onChange={e => setEditForm(f => f ? { ...f, tecido: e.target.value } : f)}
                      placeholder="Tecido" className="border rounded px-2 py-1.5 text-sm" />
                    <input value={editForm.cor ?? ''} onChange={e => setEditForm(f => f ? { ...f, cor: e.target.value } : f)}
                      placeholder="Cor" className="border rounded px-2 py-1.5 text-sm" />
                    <input value={editForm.largura} type="number" onChange={e => setEditForm(f => f ? { ...f, largura: Number(e.target.value) } : f)}
                      placeholder="Largura (cm)" className="border rounded px-2 py-1.5 text-sm" />
                    <input value={editForm.metragem} type="number" step="0.1" onChange={e => setEditForm(f => f ? { ...f, metragem: Number(e.target.value) } : f)}
                      placeholder="Metragem (m²)" className="border rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={salvarEdicao}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium">
                      <Save size={12} /> Salvar
                    </button>
                    <button onClick={() => { setEditandoId(null); setEditForm(null) }}
                      className="flex items-center gap-1 border text-gray-500 px-3 py-1.5 rounded text-xs">
                      <X size={12} /> Cancelar
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={item.id} className={cn(item.metragem <= 0.5 && 'bg-red-50/30')}>
                {/* Mobile: card */}
                <div className="md:hidden px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-gray-800">{item.tecido ?? item.tipoMaterial}</p>
                      {item.cor && <span className="text-xs text-gray-500">{item.cor}</span>}
                      {item.tipoProduto && <span className="text-xs text-gray-400">· {nomeProduto(item.tipoProduto)}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', badge.cor)}>
                        {badge.icon}{badge.label}
                      </span>
                      <span className={cn('text-xs font-semibold', item.metragem <= 0.5 ? 'text-red-600' : item.metragem <= 2 ? 'text-yellow-600' : 'text-gray-600')}>
                        {item.metragem}m²
                      </span>
                      <span className="text-xs text-gray-400">{item.largura}cm larg.</span>
                    </div>
                    {item.observacoes && <p className="text-xs text-amber-600 italic mt-0.5">{item.observacoes}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => iniciarEdicao(item)} className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => removerItemEstoque(item.id)} className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Desktop: tabela */}
                <div className={cn('hidden md:grid px-5 py-3 grid-cols-8 gap-2 items-center text-sm hover:bg-gray-50 transition-colors')}>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-800">{item.tipoMaterial}</p>
                    {item.tipoProduto && <p className="text-xs text-gray-400">{nomeProduto(item.tipoProduto)}</p>}
                    {item.observacoes && <p className="text-xs text-amber-600 italic">{item.observacoes}</p>}
                  </div>
                  <p className="text-gray-700">{item.tecido ?? '—'}</p>
                  <p className="text-gray-700">{item.cor ?? '—'}</p>
                  <p className="text-gray-600">{item.largura}cm</p>
                  <p className={cn('font-semibold', item.metragem <= 0.5 ? 'text-red-600' : item.metragem <= 2 ? 'text-yellow-600' : 'text-gray-700')}>
                    {item.metragem}m²
                  </p>
                  <div>
                    <span className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit', badge.cor)}>
                      {badge.icon}{badge.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => iniciarEdicao(item)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => removerItemEstoque(item.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
