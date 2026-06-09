/**
 * POST /api/webhook/lead
 *
 * Recebe leads do n8n (vindos do WhatsApp via Z-API / Evolution API).
 * Em produção: salva no Supabase. Por agora, valida e retorna o lead criado.
 *
 * Header obrigatório: x-webhook-secret: <WEBHOOK_SECRET>
 * (configurar a variável de ambiente WEBHOOK_SECRET no Vercel)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export interface LeadWebhookPayload {
  nome: string
  telefone: string
  cidade?: string
  produto: 'persiana' | 'rolo' | 'cortina' | 'toldo' | 'papel_de_parede'
  ambiente?: string
  largura?: number
  altura?: number
  tecido?: string
  cor?: string
  origemAnuncio?: string
  nomeCampanha?: string
  mensagemOriginal?: string
  observacoes?: string
}

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret')
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res)

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' })
  }

  // Autenticação via secret token
  const secret = process.env.WEBHOOK_SECRET
  if (secret) {
    const tokenRecebido = req.headers['x-webhook-secret']
    if (tokenRecebido !== secret) {
      return res.status(401).json({ error: 'Token inválido.' })
    }
  }

  // Validação do payload
  const body = req.body as LeadWebhookPayload

  if (!body?.nome || !body?.telefone || !body?.produto) {
    return res.status(400).json({
      error: 'Campos obrigatórios faltando.',
      obrigatorios: ['nome', 'telefone', 'produto'],
      recebido: body,
    })
  }

  const produtosValidos = ['persiana', 'rolo', 'cortina', 'toldo', 'papel_de_parede']
  if (!produtosValidos.includes(body.produto)) {
    return res.status(400).json({
      error: `Produto inválido: "${body.produto}"`,
      validos: produtosValidos,
    })
  }

  // Monta o lead no formato do sistema
  const lead = {
    id: `lead-wpp-${Date.now()}`,
    nome: body.nome.trim(),
    telefone: body.telefone.replace(/\D/g, '').replace(/^55/, ''),
    cidade: body.cidade?.trim() ?? undefined,
    produto: body.produto,
    ambiente: body.ambiente?.trim() ?? undefined,
    largura: body.largura ? Number(body.largura) : undefined,
    altura: body.altura ? Number(body.altura) : undefined,
    tecido: body.tecido?.trim() ?? undefined,
    cor: body.cor?.trim() ?? undefined,
    origemAnuncio: body.origemAnuncio ?? 'WhatsApp',
    nomeCampanha: body.nomeCampanha ?? 'WhatsApp Orgânico',
    observacoes: body.observacoes ?? body.mensagemOriginal ?? undefined,
    status: 'novo',
    dataContato: new Date().toISOString(),

    // TODO: salvar no Supabase
    // await supabase.from('leads').insert([lead])
  }

  console.log(`[webhook/lead] Novo lead recebido: ${lead.nome} — ${lead.produto}`)

  return res.status(201).json({
    success: true,
    message: `Lead criado: ${lead.nome}`,
    lead,
  })
}
