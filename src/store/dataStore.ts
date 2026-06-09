import { create } from 'zustand'
import type {
  Lead, Orcamento, Pedido, OrdemProducao,
  ItemEstoque, Instalacao, ContaPagar, Pagamento,
  StatusLead, StatusOrcamento, StatusPedido, StatusOrdemProducao
} from '@/types'
import {
  mockLeads, mockOrcamentos, mockPedidos, mockOrdens,
  mockEstoque, mockIntalacoes, mockContasPagar, mockPagamentos
} from '@/lib/mockData'

interface DataState {
  // Dados
  leads: Lead[]
  orcamentos: Orcamento[]
  pedidos: Pedido[]
  ordens: OrdemProducao[]
  estoque: ItemEstoque[]
  instalacoes: Instalacao[]
  contasPagar: ContaPagar[]
  pagamentos: Pagamento[]

  // Leads
  adicionarLead: (lead: Lead) => void
  atualizarStatusLead: (id: string, status: StatusLead) => void
  atualizarLead: (lead: Lead) => void

  // Orçamentos
  adicionarOrcamento: (orc: Orcamento) => void
  atualizarStatusOrcamento: (id: string, status: StatusOrcamento) => void

  // Pedidos
  adicionarPedido: (pedido: Pedido) => void
  atualizarPedido: (pedido: Pedido) => void
  atualizarStatusPedido: (id: string, status: StatusPedido) => void

  // Ordens
  adicionarOrdem: (ordem: OrdemProducao) => void
  atualizarStatusOrdem: (id: string, status: StatusOrdemProducao) => void
  atualizarOrdem: (ordem: OrdemProducao) => void

  // Estoque
  atualizarEstoque: (item: ItemEstoque) => void
  adicionarItemEstoque: (item: ItemEstoque) => void
  removerItemEstoque: (id: string) => void

  // Instalações
  adicionarInstalacao: (inst: Instalacao) => void
  atualizarInstalacao: (inst: Instalacao) => void

  // Financeiro
  adicionarContaPagar: (conta: ContaPagar) => void
  atualizarContaPagar: (conta: ContaPagar) => void
  adicionarPagamento: (pag: Pagamento) => void
}

export const useDataStore = create<DataState>((set) => ({
  leads: mockLeads,
  orcamentos: mockOrcamentos,
  pedidos: mockPedidos,
  ordens: mockOrdens,
  estoque: mockEstoque,
  instalacoes: mockIntalacoes,
  contasPagar: mockContasPagar,
  pagamentos: mockPagamentos,

  adicionarLead: (lead) =>
    set(s => ({ leads: [lead, ...s.leads] })),

  atualizarStatusLead: (id, status) =>
    set(s => ({ leads: s.leads.map(l => l.id === id ? { ...l, status } : l) })),

  atualizarLead: (lead) =>
    set(s => ({ leads: s.leads.map(l => l.id === lead.id ? lead : l) })),

  adicionarOrcamento: (orc) =>
    set(s => ({ orcamentos: [orc, ...s.orcamentos] })),

  atualizarStatusOrcamento: (id, status) =>
    set(s => ({ orcamentos: s.orcamentos.map(o => o.id === id ? { ...o, status } : o) })),

  adicionarPedido: (pedido) =>
    set(s => ({ pedidos: [pedido, ...s.pedidos] })),

  atualizarPedido: (pedido) =>
    set(s => ({ pedidos: s.pedidos.map(p => p.id === pedido.id ? pedido : p) })),

  atualizarStatusPedido: (id, status) =>
    set(s => ({
      pedidos: s.pedidos.map(p => p.id === id ? { ...p, status, atualizadoEm: new Date() } : p)
    })),

  adicionarOrdem: (ordem) =>
    set(s => ({ ordens: [ordem, ...s.ordens] })),

  atualizarStatusOrdem: (id, status) =>
    set(s => ({ ordens: s.ordens.map(o => o.id === id ? { ...o, status } : o) })),

  atualizarOrdem: (ordem) =>
    set(s => ({ ordens: s.ordens.map(o => o.id === ordem.id ? ordem : o) })),

  atualizarEstoque: (item) =>
    set(s => ({ estoque: s.estoque.map(e => e.id === item.id ? item : e) })),

  adicionarItemEstoque: (item) =>
    set(s => ({ estoque: [item, ...s.estoque] })),

  removerItemEstoque: (id) =>
    set(s => ({ estoque: s.estoque.filter(e => e.id !== id) })),

  adicionarInstalacao: (inst) =>
    set(s => ({ instalacoes: [inst, ...s.instalacoes] })),

  atualizarInstalacao: (inst) =>
    set(s => ({ instalacoes: s.instalacoes.map(i => i.id === inst.id ? inst : i) })),

  adicionarContaPagar: (conta) =>
    set(s => ({ contasPagar: [conta, ...s.contasPagar] })),

  atualizarContaPagar: (conta) =>
    set(s => ({ contasPagar: s.contasPagar.map(c => c.id === conta.id ? conta : c) })),

  adicionarPagamento: (pag) =>
    set(s => ({ pagamentos: [pag, ...s.pagamentos] })),
}))
