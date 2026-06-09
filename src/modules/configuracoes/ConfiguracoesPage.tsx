import { useState } from 'react'
import type { Instalador, TipoProduto } from '@/types'
import { mockInstaladores, mockUsuarios } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Plus, Pencil, Trash2, Check, X, Users, Wrench, DollarSign } from 'lucide-react'

type Aba = 'instaladores' | 'precos' | 'usuarios'

// Tabela de preços base por tipo e modelo
interface PrecoItem {
  id: string
  tipoProduto: TipoProduto
  modelo: string
  precoM2: number
  precoInstalacao: number
}

const precosIniciais: PrecoItem[] = [
  { id: 'pr1', tipoProduto: 'persiana', modelo: 'Standard', precoM2: 185, precoInstalacao: 120 },
  { id: 'pr2', tipoProduto: 'persiana', modelo: 'Motorizado', precoM2: 280, precoInstalacao: 150 },
  { id: 'pr3', tipoProduto: 'rolo', modelo: 'Standard', precoM2: 168, precoInstalacao: 100 },
  { id: 'pr4', tipoProduto: 'rolo', modelo: 'Motorizado', precoM2: 245, precoInstalacao: 130 },
  { id: 'pr5', tipoProduto: 'cortina', modelo: 'Com forro', precoM2: 210, precoInstalacao: 150 },
  { id: 'pr6', tipoProduto: 'cortina', modelo: 'Blackout', precoM2: 240, precoInstalacao: 180 },
  { id: 'pr7', tipoProduto: 'toldo', modelo: 'Articulado', precoM2: 220, precoInstalacao: 280 },
  { id: 'pr8', tipoProduto: 'toldo', modelo: 'Fixo', precoM2: 180, precoInstalacao: 220 },
  { id: 'pr9', tipoProduto: 'papel_de_parede', modelo: 'Standard', precoM2: 145, precoInstalacao: 280 },
  { id: 'pr10', tipoProduto: 'papel_de_parede', modelo: 'Premium', precoM2: 195, precoInstalacao: 300 },
]

const nomeProdutoLabel: Record<TipoProduto, string> = {
  persiana: 'Persiana',
  rolo: 'Rolo',
  cortina: 'Cortina',
  toldo: 'Toldo',
  papel_de_parede: 'Papel de Parede',
}

const produtoCor: Record<TipoProduto, string> = {
  persiana: 'bg-blue-100 text-blue-700',
  rolo: 'bg-purple-100 text-purple-700',
  cortina: 'bg-pink-100 text-pink-700',
  toldo: 'bg-orange-100 text-orange-700',
  papel_de_parede: 'bg-yellow-100 text-yellow-700',
}

const perfilCor: Record<string, string> = {
  gestor: 'bg-[#2D2D2D]/10 text-[#2D2D2D]',
  comercial: 'bg-blue-100 text-blue-700',
  producao: 'bg-orange-100 text-orange-700',
}

// ─── Subcomponente: Instaladores ───────────────────────────────────────────────
function AbaInstaladores() {
  const [instaladores, setInstaladores] = useState<Instalador[]>(mockInstaladores)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [novoAberto, setNovoAberto] = useState(false)
  const [formNovo, setFormNovo] = useState({ nome: '', telefone: '', pixChave: '', tipoChavePix: 'pix' })
  const [formEdit, setFormEdit] = useState<Instalador | null>(null)

  const input = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]'

  function salvarNovo() {
    if (!formNovo.nome || !formNovo.telefone) return
    const novo: Instalador = {
      id: `i-${Date.now()}`,
      nome: formNovo.nome,
      telefone: formNovo.telefone,
      pixChave: formNovo.pixChave || undefined,
      tipoChavePix: formNovo.tipoChavePix || undefined,
      ativo: true,
    }
    setInstaladores(prev => [...prev, novo])
    setFormNovo({ nome: '', telefone: '', pixChave: '', tipoChavePix: 'pix' })
    setNovoAberto(false)
  }

  function salvarEdicao() {
    if (!formEdit) return
    setInstaladores(prev => prev.map(i => i.id === formEdit.id ? formEdit : i))
    setEditandoId(null)
    setFormEdit(null)
  }

  function toggleAtivo(id: string) {
    setInstaladores(prev => prev.map(i => i.id === id ? { ...i, ativo: !i.ativo } : i))
  }

  function remover(id: string) {
    if (confirm('Remover instalador?')) {
      setInstaladores(prev => prev.filter(i => i.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{instaladores.filter(i => i.ativo).length} instaladores ativos</p>
        <button
          onClick={() => setNovoAberto(true)}
          className="flex items-center gap-2 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Novo instalador
        </button>
      </div>

      {/* Form novo */}
      {novoAberto && (
        <div className="bg-[#2D2D2D]/5 border border-[#2D2D2D]/20 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-[#2D2D2D]">Novo Instalador</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nome *</label>
              <input className={input} value={formNovo.nome} onChange={e => setFormNovo(p => ({ ...p, nome: e.target.value }))} placeholder="Nome completo" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Telefone *</label>
              <input className={input} value={formNovo.telefone} onChange={e => setFormNovo(p => ({ ...p, telefone: e.target.value }))} placeholder="11 99999-9999" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Chave PIX</label>
              <input className={input} value={formNovo.pixChave} onChange={e => setFormNovo(p => ({ ...p, pixChave: e.target.value }))} placeholder="Chave PIX" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tipo da chave</label>
              <select className={input} value={formNovo.tipoChavePix} onChange={e => setFormNovo(p => ({ ...p, tipoChavePix: e.target.value }))}>
                <option value="pix">Chave aleatória</option>
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="cpf">CPF</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setNovoAberto(false)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={salvarNovo} className="px-4 py-2 bg-[#2D2D2D] text-white text-sm rounded-lg hover:bg-[#3A3A3A]">Salvar</button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {instaladores.map(inst => (
          <div key={inst.id} className={cn('bg-white border rounded-xl p-4 transition-all', inst.ativo ? 'border-gray-100' : 'border-gray-100 opacity-60')}>
            {editandoId === inst.id && formEdit ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nome</label>
                    <input className={input} value={formEdit.nome} onChange={e => setFormEdit(p => p ? { ...p, nome: e.target.value } : p)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Telefone</label>
                    <input className={input} value={formEdit.telefone} onChange={e => setFormEdit(p => p ? { ...p, telefone: e.target.value } : p)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Chave PIX</label>
                    <input className={input} value={formEdit.pixChave ?? ''} onChange={e => setFormEdit(p => p ? { ...p, pixChave: e.target.value } : p)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
                    <select className={input} value={formEdit.tipoChavePix ?? ''} onChange={e => setFormEdit(p => p ? { ...p, tipoChavePix: e.target.value } : p)}>
                      <option value="pix">Chave aleatória</option>
                      <option value="telefone">Telefone</option>
                      <option value="email">E-mail</option>
                      <option value="cpf">CPF</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditandoId(null); setFormEdit(null) }} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><X size={15} /></button>
                  <button onClick={salvarEdicao} className="flex items-center gap-1.5 px-4 py-2 bg-[#2D2D2D] text-white text-sm rounded-lg hover:bg-[#3A3A3A]">
                    <Check size={14} /> Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#2D2D2D]/10 flex items-center justify-center text-[#2D2D2D] font-bold text-sm shrink-0">
                    {inst.nome.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{inst.nome}</p>
                    <p className="text-xs text-gray-500">{inst.telefone}</p>
                    {inst.pixChave && (
                      <p className="text-xs text-gray-400">PIX ({inst.tipoChavePix}): {inst.pixChave}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAtivo(inst.id)}
                    className={cn('text-xs px-2.5 py-1 rounded-full font-medium transition-colors', inst.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                  >
                    {inst.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                  <button
                    onClick={() => { setEditandoId(inst.id); setFormEdit({ ...inst }) }}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remover(inst.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Subcomponente: Tabela de Preços ───────────────────────────────────────────
function AbaPrecos() {
  const [precos, setPrecos] = useState<PrecoItem[]>(precosIniciais)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [valoresEdit, setValoresEdit] = useState({ precoM2: '', precoInstalacao: '' })

  function iniciarEdicao(item: PrecoItem) {
    setEditandoId(item.id)
    setValoresEdit({ precoM2: item.precoM2.toString(), precoInstalacao: item.precoInstalacao.toString() })
  }

  function salvarEdicao(id: string) {
    setPrecos(prev => prev.map(p => p.id === id ? {
      ...p,
      precoM2: parseFloat(valoresEdit.precoM2) || p.precoM2,
      precoInstalacao: parseFloat(valoresEdit.precoInstalacao) || p.precoInstalacao,
    } : p))
    setEditandoId(null)
  }

  const grupos = Array.from(new Set(precos.map(p => p.tipoProduto))) as TipoProduto[]

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Preços padrão usados no cálculo automático de orçamentos. Você pode ajustar por orçamento individualmente.</p>

      {grupos.map(tipo => (
        <div key={tipo} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', produtoCor[tipo])}>
              {nomeProdutoLabel[tipo]}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-50">
                <th className="text-left px-4 py-2 font-medium">Modelo</th>
                <th className="text-right px-4 py-2 font-medium">Preço / m²</th>
                <th className="text-right px-4 py-2 font-medium">Instalação base</th>
                <th className="px-4 py-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {precos.filter(p => p.tipoProduto === tipo).map(item => (
                <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-700">{item.modelo}</td>
                  <td className="px-4 py-3 text-right">
                    {editandoId === item.id ? (
                      <input
                        type="number"
                        className="w-24 px-2 py-1 border border-[#2D2D2D] rounded-lg text-right text-sm focus:outline-none"
                        value={valoresEdit.precoM2}
                        onChange={e => setValoresEdit(p => ({ ...p, precoM2: e.target.value }))}
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-[#2D2D2D]">R$ {item.precoM2.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editandoId === item.id ? (
                      <input
                        type="number"
                        className="w-24 px-2 py-1 border border-[#2D2D2D] rounded-lg text-right text-sm focus:outline-none"
                        value={valoresEdit.precoInstalacao}
                        onChange={e => setValoresEdit(p => ({ ...p, precoInstalacao: e.target.value }))}
                      />
                    ) : (
                      <span className="text-gray-600">R$ {item.precoInstalacao.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editandoId === item.id ? (
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => setEditandoId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={13} /></button>
                        <button onClick={() => salvarEdicao(item.id)} className="p-1.5 bg-[#2D2D2D] hover:bg-[#3A3A3A] rounded-lg text-white"><Check size={13} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => iniciarEdicao(item)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 ml-auto flex"
                      >
                        <Pencil size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// ─── Subcomponente: Usuários ───────────────────────────────────────────────────
function AbaUsuarios() {
  const usuarios = mockUsuarios

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{usuarios.length} usuários cadastrados</p>
        <button
          onClick={() => alert('Em breve: convidar novos usuários via e-mail')}
          className="flex items-center gap-2 bg-[#2D2D2D] hover:bg-[#3A3A3A] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Convidar usuário
        </button>
      </div>

      <div className="space-y-2">
        {usuarios.map(u => (
          <div key={u.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2D2D2D]/10 flex items-center justify-center text-[#2D2D2D] font-bold">
                {u.nome.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{u.nome}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium capitalize', perfilCor[u.perfil])}>
                {u.perfil}
              </span>
              <button
                onClick={() => alert('Em breve: editar perfil de acesso')}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-700 mb-1">Níveis de acesso</p>
        <ul className="text-xs text-blue-600 space-y-1 mt-2">
          <li><span className="font-semibold">Gestor</span> — acesso total: financeiro, métricas, CRM, produção, instalações</li>
          <li><span className="font-semibold">Comercial</span> — CRM, orçamentos, pedidos, status de produção, instalações</li>
          <li><span className="font-semibold">Produção</span> — ordens de produção e controle de estoque</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────
export function ConfiguracoesPage() {
  const [aba, setAba] = useState<Aba>('instaladores')

  const abas: { key: Aba; label: string; icon: React.ReactNode }[] = [
    { key: 'instaladores', label: 'Instaladores', icon: <Wrench size={16} /> },
    { key: 'precos', label: 'Tabela de Preços', icon: <DollarSign size={16} /> },
    { key: 'usuarios', label: 'Usuários', icon: <Users size={16} /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie instaladores, preços e acessos do sistema</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-100 rounded-xl p-1 flex gap-1 shadow-sm w-fit">
        {abas.map(a => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              aba === a.key
                ? 'bg-[#2D2D2D] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl">
        {aba === 'instaladores' && <AbaInstaladores />}
        {aba === 'precos' && <AbaPrecos />}
        {aba === 'usuarios' && <AbaUsuarios />}
      </div>
    </div>
  )
}
