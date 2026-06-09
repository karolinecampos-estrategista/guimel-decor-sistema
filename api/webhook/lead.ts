import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

function corsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  corsHeaders(res)

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' })

  const secret = process.env.WEBHOOK_SECRET
  if (secret && req.headers['x-webhook-secret'] !== secret) {
    return res.status(401).json({ error: 'Token inválido.' })
  }

  const body = req.body
  if (!body?.nome || !body?.telefone || !body?.produto) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, telefone, produto.' })
  }

  const lead = {
    nome: String(body.nome).trim(),
    telefone: String(body.telefone).replace(/\D/g, '').replace(/^55/, ''),
    cidade: body.cidade?.trim() || null,
    produto: String(body.produto).trim(),
    ambiente: body.ambiente?.trim() || null,
    medidas: body.medidas?.trim() || null,
    origem: body.origem || 'WhatsApp',
    status: 'novo',
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data, error } = await supabase.from('leads').insert([lead]).select().single()

  if (error) {
    console.error('[webhook/lead] Erro Supabase:', error)
    return res.status(500).json({ error: 'Erro ao salvar lead.', detail: error.message })
  }

  console.log(`[webhook/lead] Lead salvo: ${lead.nome} — ${lead.produto}`)
  return res.status(201).json({ success: true, message: `Lead criado: ${lead.nome}`, lead: data })
}
