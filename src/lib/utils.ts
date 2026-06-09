import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { TipoProduto, StatusLead, StatusPedido, StatusOrdemProducao } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatData(data: Date): string {
  return format(data, 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDataHora(data: Date): string {
  return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function tempoDecorrido(data: Date): string {
  return formatDistanceToNow(data, { locale: ptBR, addSuffix: true })
}

export function nomeProduto(tipo: TipoProduto): string {
  const nomes: Record<TipoProduto, string> = {
    persiana: 'Persiana',
    rolo: 'Rolo',
    cortina: 'Cortina',
    toldo: 'Toldo',
    papel_de_parede: 'Papel de Parede',
  }
  return nomes[tipo]
}

export function labelStatusLead(status: StatusLead): string {
  const labels: Record<StatusLead, string> = {
    novo: 'Novo Lead',
    em_contato: 'Em Contato',
    nao_responde: 'Não Responde',
    so_chamou: 'Só Chamou',
    orcamento_enviado: 'Orçamento Enviado',
    aguardando: 'Aguardando',
    convertido: 'Convertido',
    perdido: 'Perdido',
  }
  return labels[status]
}

export function labelStatusPedido(status: StatusPedido): string {
  const labels: Record<StatusPedido, string> = {
    aguardando_producao: 'Aguardando Produção',
    em_producao: 'Em Produção',
    pronto_retirada: 'Pronto para Retirada',
    instalacao_agendada: 'Instalação Agendada',
    instalado: 'Instalado',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
  }
  return labels[status]
}

export function labelStatusOrdem(status: StatusOrdemProducao): string {
  const labels: Record<StatusOrdemProducao, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    pronto: 'Pronto',
    retirado: 'Retirado',
  }
  return labels[status]
}

export function corStatusPedido(status: StatusPedido): string {
  const cores: Record<StatusPedido, string> = {
    aguardando_producao: 'bg-yellow-100 text-yellow-800',
    em_producao: 'bg-blue-100 text-blue-800',
    pronto_retirada: 'bg-green-100 text-green-800',
    instalacao_agendada: 'bg-purple-100 text-purple-800',
    instalado: 'bg-indigo-100 text-indigo-800',
    concluido: 'bg-gray-100 text-gray-600',
    cancelado: 'bg-red-100 text-red-800',
  }
  return cores[status]
}
