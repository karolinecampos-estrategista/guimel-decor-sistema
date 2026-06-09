import type { Lead, TipoProduto, StatusLead } from '@/types'
import type { LeadRow } from './supabase'

function mapProduto(texto: string): TipoProduto {
  const p = texto.toLowerCase()
  if (p.includes('papel')) return 'papel_de_parede'
  if (p.includes('toldo')) return 'toldo'
  if (p.includes('cortina')) return 'cortina'
  if (p.includes('rolo') || p.includes('blackout') || p.includes('tela solar') || p.includes('solar')) return 'rolo'
  if (p.includes('persiana')) return 'persiana'
  return 'persiana'
}

function parseMedidas(medidas: string | null): { largura?: number; altura?: number } {
  if (!medidas) return {}
  const normalizado = medidas.replace(/,/g, '.').replace(/m/gi, '')
  const match = normalizado.match(/([\d.]+)\s*[xX×]\s*([\d.]+)/)
  if (match) return { largura: parseFloat(match[1]), altura: parseFloat(match[2]) }
  return {}
}

const STATUS_VALIDOS: StatusLead[] = [
  'novo', 'em_contato', 'nao_responde', 'so_chamou',
  'orcamento_enviado', 'aguardando', 'convertido', 'perdido',
]

function mapStatus(status: string): StatusLead {
  return STATUS_VALIDOS.includes(status as StatusLead)
    ? (status as StatusLead)
    : 'novo'
}

export function rowToLead(row: LeadRow): Lead {
  const { largura, altura } = parseMedidas(row.medidas)
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    cidade: row.cidade ?? undefined,
    produto: mapProduto(row.produto),
    ambiente: row.ambiente ?? undefined,
    largura,
    altura,
    origemAnuncio: row.origem ?? 'WhatsApp',
    status: mapStatus(row.status),
    dataContato: new Date(row.created_at),
    observacoes: row.medidas ?? undefined,
  }
}
