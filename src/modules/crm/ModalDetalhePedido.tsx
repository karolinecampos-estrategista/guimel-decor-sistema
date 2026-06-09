import { useState } from 'react'
import type { Pedido, StatusPedido, Pagamento } from '@/types'
import {
  X, Edit2, Printer, Download, MessageCircle, CheckCircle,
  Phone, MapPin, Calendar, CreditCard, Save, ChevronDown, User
} from 'lucide-react'
import { cn, formatMoeda, formatData, labelStatusPedido, corStatusPedido, nomeProduto } from '@/lib/utils'
import { useDataStore } from '@/store/dataStore'

interface Props {
  pedido: Pedido
  onClose: () => void
}

const todosStatus: StatusPedido[] = [
  'aguardando_producao', 'em_producao', 'pronto_retirada',
  'instalacao_agendada', 'instalado', 'concluido', 'cancelado'
]

function gerarHTMLPedido(p: Pedido): string {
  return `<!DOCTYPE html><html lang="pt-BR">
<head><meta charset="UTF-8"><title>Pedido ${p.numeroPedido}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#222;font-size:14px}
  .logo{font-size:22px;font-weight:700;color:#E87820;margin-bottom:4px}
  .subtitle{font-size:12px;color:#666;margin-bottom:24px}
  h2{font-size:16px;border-bottom:2px solid #E87820;padding-bottom:6px;margin:20px 0 12px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .field label{font-size:11px;color:#888;display:block;margin-bottom:2px}
  .field span{font-weight:600}
  .total{background:#f5f5f5;border-radius:8px;padding:16px;margin:16px 0}
  .total-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee}
  .total-final{font-size:18px;font-weight:700;color:#E87820;display:flex;justify-content:space-between;padding-top:10px}
  .badge{display:inline-block;background:#E87820;color:white;border-radius:12px;padding:3px 12px;font-size:12px;font-weight:600}
  .obs{background:#fffbf5;border:1px solid #f0d9b5;border-radius:8px;padding:12px;margin-top:16px;font-size:13px}
  .footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center}
  @media print{body{padding:16px}}
</style></head>
<body>
<div class="logo">Guimel Decor</div>
<div class="subtitle">Fábrica de Persianas, Rolos e Cortinas · guimelstore.com.br</div>
<h2>Pedido ${p.numeroPedido}</h2>
<div class="grid">
  <div class="field"><label>Cliente</label><span>${p.leadNome}</span></div>
  <div class="field"><label>Telefone</label><span>${p.telefone}</span></div>
  <div class="field"><label>Produto</label><span>${nomeProduto(p.tipoProduto)}</span></div>
  <div class="field"><label>Medidas</label><span>${p.largura}m × ${p.altura}m</span></div>
  ${p.tecido ? `<div class="field"><label>Tecido</label><span>${p.tecido}</span></div>` : ''}
  ${p.cor ? `<div class="field"><label>Cor</label><span>${p.cor}</span></div>` : ''}
  ${p.modelo ? `<div class="field"><label>Modelo</label><span>${p.modelo}</span></div>` : ''}
  ${p.dataPrevistanInstalacao ? `<div class="field"><label>Data de Instalação</label><span>${formatData(new Date(p.dataPrevistanInstalacao))}</span></div>` : ''}
  ${p.enderecoInstalacao ? `<div class="field"><label>Endereço</label><span>${p.enderecoInstalacao}${p.cidade ? ', ' + p.cidade : ''}</span></div>` : ''}
</div>
${(p.nomeRazaoSocial || p.cpf || p.cnpj || p.enderecoFiscal) ? `
<h2>Dados do Cliente</h2>
<div class="grid">
  ${p.nomeRazaoSocial ? `<div class="field"><label>Nome / Razão Social</label><span>${p.nomeRazaoSocial}</span></div>` : ''}
  ${p.cpf ? `<div class="field"><label>CPF</label><span>${p.cpf}</span></div>` : ''}
  ${p.cnpj ? `<div class="field"><label>CNPJ</label><span>${p.cnpj}</span></div>` : ''}
  ${p.enderecoFiscal ? `<div class="field" style="grid-column:span 2"><label>Endereço</label><span>${p.enderecoFiscal}</span></div>` : ''}
</div>` : ''}
<h2>Pagamento</h2>
<div class="total">
  <div class="total-row"><span>Valor total</span><span>${formatMoeda(p.valorTotal)}</span></div>
  <div class="total-row"><span>Sinal (${p.formaSinal ?? ''})</span><span>${formatMoeda(p.valorSinal)}</span></div>
  <div class="total-final"><span>Saldo restante</span><span>${formatMoeda(p.valorRestante)}</span></div>
  ${p.formaPagamentoFinal ? `<div style="margin-top:8px;font-size:12px;color:#888">Forma de pagamento do saldo: ${p.formaPagamentoFinal}</div>` : ''}
</div>
<div><span class="badge">Status: ${labelStatusPedido(p.status)}</span></div>
${p.observacoes ? `<div class="obs">📝 ${p.observacoes}</div>` : ''}
<div class="footer">Gerado em ${formatData(new Date())} · Guimel Decor — Sistema de Gestão</div>
</body></html>`
}

function gerarHTMLOrdemProducao(p: Pedido): string {
  return `<!DOCTYPE html><html lang="pt-BR">
<head><meta charset="UTF-8"><title>Ordem de Produção — ${p.numeroPedido}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#222;font-size:14px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #2D2D2D}
  .logo{font-size:24px;font-weight:700;color:#E87820}
  .op-badge{background:#2D2D2D;color:white;padding:8px 16px;border-radius:8px;font-size:14px;font-weight:700}
  h2{font-size:14px;background:#2D2D2D;color:white;padding:8px 12px;border-radius:6px;margin:20px 0 12px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .field{background:#f5f5f5;border-radius:8px;padding:10px 12px}
  .field label{font-size:11px;color:#888;display:block;margin-bottom:2px}
  .field span{font-size:15px;font-weight:700;color:#2D2D2D}
  .destaque{background:#fff8f0;border:2px solid #E87820;border-radius:8px;padding:16px;margin:16px 0}
  .check{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px dashed #ddd;font-size:13px}
  .check-box{width:20px;height:20px;border:2px solid #aaa;border-radius:4px;display:inline-block;flex-shrink:0}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center}
  @media print{body{padding:16px}}
</style></head>
<body>
<div class="header">
  <div>
    <div class="logo">Guimel Decor</div>
    <div style="font-size:12px;color:#666;margin-top:2px">Ordem de Produção</div>
  </div>
  <div class="op-badge">${p.numeroPedido}</div>
</div>

<h2>📦 Especificações do Produto</h2>
<div class="grid">
  <div class="field"><label>Produto</label><span>${nomeProduto(p.tipoProduto)}</span></div>
  <div class="field"><label>Medidas</label><span>${p.largura}m × ${p.altura}m</span></div>
  ${p.tecido ? `<div class="field"><label>Tecido</label><span>${p.tecido}</span></div>` : ''}
  ${p.cor ? `<div class="field"><label>Cor</label><span>${p.cor}</span></div>` : ''}
  ${p.modelo ? `<div class="field"><label>Modelo / Sistema</label><span>${p.modelo}</span></div>` : ''}
</div>

<div class="destaque">
  <strong>Cliente:</strong> ${p.leadNome}<br>
  ${p.dataPrevistanInstalacao ? `<strong>Data da instalação:</strong> ${formatData(new Date(p.dataPrevistanInstalacao))}` : ''}
  ${p.enderecoInstalacao ? `<br><strong>Endereço:</strong> ${p.enderecoInstalacao}${p.cidade ? ', ' + p.cidade : ''}` : ''}
</div>

<h2>✅ Checklist de Produção</h2>
<div class="check"><div class="check-box"></div> Material separado e conferido</div>
<div class="check"><div class="check-box"></div> Medidas conferidas antes do corte</div>
<div class="check"><div class="check-box"></div> Produto finalizado e inspecionado</div>
<div class="check"><div class="check-box"></div> Embalado e identificado com número do pedido</div>
<div class="check"><div class="check-box"></div> Pronto para retirada/instalação</div>

${p.observacoes ? `<h2>📝 Observações</h2><div style="padding:12px;background:#fffbf5;border:1px solid #f0d9b5;border-radius:8px">${p.observacoes}</div>` : ''}

<div class="footer">Emitido em ${formatData(new Date())} · Guimel Decor</div>
</body></html>`
}

function abrirJanela(html: string) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 400)
}

export function ModalDetalhePedido({ pedido: p, onClose }: Props) {
  const { atualizarPedido, atualizarStatusPedido, adicionarPagamento, pagamentos } = useDataStore()
  const [editando, setEditando] = useState(false)
  const [statusMenu, setStatusMenu] = useState(false)

  const [form, setForm] = useState({
    descricaoProduto: p.descricaoProduto,
    largura: p.largura,
    altura: p.altura,
    tecido: p.tecido ?? '',
    cor: p.cor ?? '',
    modelo: p.modelo ?? '',
    valorTotal: p.valorTotal,
    valorSinal: p.valorSinal,
    formaSinal: p.formaSinal ?? '',
    formaPagamentoFinal: p.formaPagamentoFinal ?? '',
    dataPrevistanInstalacao: p.dataPrevistanInstalacao
      ? new Date(p.dataPrevistanInstalacao).toISOString().split('T')[0]
      : '',
    enderecoInstalacao: p.enderecoInstalacao ?? '',
    cidade: p.cidade ?? '',
    observacoes: p.observacoes ?? '',
    nomeRazaoSocial: p.nomeRazaoSocial ?? '',
    cpf: p.cpf ?? '',
    cnpj: p.cnpj ?? '',
    enderecoFiscal: p.enderecoFiscal ?? '',
  })

  const pagamentosDoPedido = pagamentos.filter(pg => pg.pedidoId === p.id)
  const totalRecebido = pagamentosDoPedido.reduce((a, pg) => a + pg.valor, 0)

  function salvar() {
    atualizarPedido({
      ...p,
      descricaoProduto: form.descricaoProduto,
      largura: Number(form.largura),
      altura: Number(form.altura),
      tecido: form.tecido || undefined,
      cor: form.cor || undefined,
      modelo: form.modelo || undefined,
      valorTotal: Number(form.valorTotal),
      valorSinal: Number(form.valorSinal),
      formaSinal: form.formaSinal || undefined,
      valorRestante: Number(form.valorTotal) - Number(form.valorSinal),
      formaPagamentoFinal: form.formaPagamentoFinal || undefined,
      dataPrevistanInstalacao: form.dataPrevistanInstalacao
        ? new Date(form.dataPrevistanInstalacao)
        : undefined,
      enderecoInstalacao: form.enderecoInstalacao || undefined,
      cidade: form.cidade || undefined,
      observacoes: form.observacoes || undefined,
      nomeRazaoSocial: form.nomeRazaoSocial || undefined,
      cpf: form.cpf || undefined,
      cnpj: form.cnpj || undefined,
      enderecoFiscal: form.enderecoFiscal || undefined,
      atualizadoEm: new Date(),
    })
    setEditando(false)
  }

  function registrarPagamento(tipo: 'entrada' | 'saldo') {
    const valor = tipo === 'entrada' ? p.valorSinal : p.valorRestante
    adicionarPagamento({
      id: `pg-${Date.now()}`,
      pedidoId: p.id,
      clienteNome: p.leadNome,
      tipo,
      valor,
      forma: tipo === 'entrada' ? (p.formaSinal ?? 'pix') : (p.formaPagamentoFinal ?? 'pix'),
      dataPagamento: new Date(),
      confirmado: true,
    })
  }

  function enviarWhatsApp() {
    const msg = encodeURIComponent(
      `Olá ${p.leadNome}! 😊\n\n` +
      `Aqui é a *Guimel Decor*. Seu pedido foi confirmado!\n\n` +
      `🔢 *${p.numeroPedido}*\n` +
      `🪟 ${nomeProduto(p.tipoProduto)}${p.cor ? ` ${p.cor}` : ''} — ${p.largura}m × ${p.altura}m\n` +
      `💰 Total: *${formatMoeda(p.valorTotal)}*\n` +
      (p.dataPrevistanInstalacao
        ? `📅 Instalação prevista: ${formatData(new Date(p.dataPrevistanInstalacao))}\n`
        : '') +
      `\nQualquer dúvida, é só chamar! 🙏`
    )
    window.open(`https://wa.me/55${p.telefone.replace(/\D/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-xs text-gray-400">{p.numeroPedido}</p>
              <p className="font-bold text-gray-900 text-lg leading-tight">{p.leadNome}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setStatusMenu(v => !v)}
                className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium', corStatusPedido(p.status))}
              >
                {labelStatusPedido(p.status)}
                <ChevronDown size={12} />
              </button>
              {statusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-10 py-1 min-w-[200px]">
                  {todosStatus.map(s => (
                    <button
                      key={s}
                      onClick={() => { atualizarStatusPedido(p.id, s); setStatusMenu(false) }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-xs hover:bg-gray-50',
                        p.status === s ? 'font-semibold text-[#E87820]' : 'text-gray-700'
                      )}
                    >
                      {labelStatusPedido(s)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {editando ? (
            /* Modo edição */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Largura (m)</label>
                  <input type="number" step="0.1" value={form.largura}
                    onChange={e => setForm(f => ({ ...f, largura: Number(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Altura (m)</label>
                  <input type="number" step="0.1" value={form.altura}
                    onChange={e => setForm(f => ({ ...f, altura: Number(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Tecido</label>
                  <input value={form.tecido}
                    onChange={e => setForm(f => ({ ...f, tecido: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Cor</label>
                  <input value={form.cor}
                    onChange={e => setForm(f => ({ ...f, cor: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Modelo</label>
                  <input value={form.modelo}
                    onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Valor total (R$)</label>
                  <input type="number" step="0.01" value={form.valorTotal}
                    onChange={e => setForm(f => ({ ...f, valorTotal: Number(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Sinal (R$)</label>
                  <input type="number" step="0.01" value={form.valorSinal}
                    onChange={e => setForm(f => ({ ...f, valorSinal: Number(e.target.value) }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Forma do sinal</label>
                  <select value={form.formaSinal}
                    onChange={e => setForm(f => ({ ...f, formaSinal: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">Selecione</option>
                    <option value="pix">Pix</option>
                    <option value="transferencia">Transferência</option>
                    <option value="maquininha">Maquininha</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Pagamento final</label>
                  <select value={form.formaPagamentoFinal}
                    onChange={e => setForm(f => ({ ...f, formaPagamentoFinal: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">Selecione</option>
                    <option value="pix">Pix</option>
                    <option value="transferencia">Transferência</option>
                    <option value="maquininha">Maquininha</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pago">Já pago</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Data prevista instalação</label>
                  <input type="date" value={form.dataPrevistanInstalacao}
                    onChange={e => setForm(f => ({ ...f, dataPrevistanInstalacao: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Endereço de instalação</label>
                <input value={form.enderecoInstalacao}
                  onChange={e => setForm(f => ({ ...f, enderecoInstalacao: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Cidade</label>
                <input value={form.cidade}
                  onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>

              {/* Separador dados fiscais */}
              <div className="pt-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User size={12} /> Dados do cliente (NF / Nota)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Nome completo ou razão social</label>
                    <input value={form.nomeRazaoSocial}
                      onChange={e => setForm(f => ({ ...f, nomeRazaoSocial: e.target.value }))}
                      placeholder="Como consta no documento"
                      className="w-full border rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">CPF</label>
                    <input value={form.cpf}
                      onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                      className="w-full border rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">CNPJ</label>
                    <input value={form.cnpj}
                      onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))}
                      placeholder="00.000.000/0000-00"
                      className="w-full border rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Endereço completo (rua, nº, bairro, CEP, cidade)</label>
                    <input value={form.enderecoFiscal}
                      onChange={e => setForm(f => ({ ...f, enderecoFiscal: e.target.value }))}
                      placeholder="Rua das Flores, 123 — Jd. Primavera — 01234-567 — São Paulo/SP"
                      className="w-full border rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Observações</label>
                <textarea value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
            </div>
          ) : (
            /* Modo visualização */
            <>
              {/* Produto */}
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Produto</p>
                <div className="bg-gray-50 rounded-xl px-4 py-1">
                  {[
                    ['Tipo', nomeProduto(p.tipoProduto)],
                    ['Medidas', `${p.largura}m × ${p.altura}m`],
                    ['Tecido', p.tecido],
                    ['Cor', p.cor],
                    ['Modelo', p.modelo],
                    ['Descrição', p.descricaoProduto],
                  ].filter(([, v]) => v).map(([l, v]) => (
                    <div key={l as string} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{l}</span>
                      <span className="text-sm font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pagamento */}
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pagamento</p>
                <div className="bg-gray-50 rounded-xl px-4 py-1">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Valor total</span>
                    <span className="text-sm font-bold text-[#2D2D2D]">{formatMoeda(p.valorTotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Sinal ({p.formaSinal ?? '-'})</span>
                    <span className="text-sm font-medium text-green-700">{formatMoeda(p.valorSinal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Saldo restante ({p.formaPagamentoFinal ?? '-'})</span>
                    <span className={cn('text-sm font-medium', p.valorRestante > 0 ? 'text-red-600' : 'text-green-600')}>
                      {formatMoeda(p.valorRestante)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Total recebido</span>
                    <span className="text-sm font-medium text-green-700">{formatMoeda(totalRecebido)}</span>
                  </div>
                </div>

                {/* Registrar pagamento */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => registrarPagamento('entrada')}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg"
                  >
                    <CreditCard size={12} />
                    Confirmar sinal recebido
                  </button>
                  {p.valorRestante > 0 && (
                    <button
                      onClick={() => registrarPagamento('saldo')}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg"
                    >
                      <CheckCircle size={12} />
                      Confirmar saldo recebido
                    </button>
                  )}
                </div>
              </section>

              {/* Instalação */}
              {(p.dataPrevistanInstalacao || p.enderecoInstalacao) && (
                <section>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Instalação</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-1">
                    {p.dataPrevistanInstalacao && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar size={13} /> Data prevista</span>
                        <span className="text-sm font-medium text-gray-800">{formatData(new Date(p.dataPrevistanInstalacao))}</span>
                      </div>
                    )}
                    {p.enderecoInstalacao && (
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5"><MapPin size={13} /> Endereço</span>
                        <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">
                          {p.enderecoInstalacao}{p.cidade ? `, ${p.cidade}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Dados do cliente / NF */}
              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User size={12} /> Dados do cliente (NF)
                </p>
                <div className="bg-gray-50 rounded-xl px-4 py-1">
                  {([
                    ['Nome / Razão Social', p.nomeRazaoSocial],
                    ['CPF', p.cpf],
                    ['CNPJ', p.cnpj],
                    ['Endereço fiscal', p.enderecoFiscal],
                  ] as [string, string | undefined][]).map(([l, v]) => (
                    <div key={l} className="flex justify-between py-2 border-b border-gray-100 last:border-0 gap-4">
                      <span className="text-sm text-gray-500 shrink-0">{l}</span>
                      {v
                        ? <span className="text-sm font-medium text-gray-800 text-right">{v}</span>
                        : <span className="text-sm text-gray-300 italic">Não informado</span>
                      }
                    </div>
                  ))}
                </div>
                {!p.nomeRazaoSocial && !p.cpf && !p.cnpj && !p.enderecoFiscal && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2">
                    Clique em "Editar pedido" para preencher os dados do cliente para a nota fiscal.
                  </p>
                )}
              </section>

              {/* Observações */}
              {p.observacoes && (
                <section>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Observações</p>
                  <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{p.observacoes}</p>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 shrink-0 space-y-2">
          {/* Ações de documentos */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => abrirJanela(gerarHTMLPedido(p))}
              className="flex flex-col items-center gap-1 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs py-2.5 rounded-xl transition-colors"
            >
              <Printer size={15} />
              Imprimir
            </button>
            <button
              onClick={() => abrirJanela(gerarHTMLPedido(p))}
              className="flex flex-col items-center gap-1 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs py-2.5 rounded-xl transition-colors"
            >
              <Download size={15} />
              Baixar PDF
            </button>
            <button
              onClick={() => abrirJanela(gerarHTMLOrdemProducao(p))}
              className="flex flex-col items-center gap-1 bg-[#2D2D2D]/5 border border-[#2D2D2D]/20 hover:bg-[#2D2D2D]/10 text-[#2D2D2D] text-xs py-2.5 rounded-xl transition-colors"
            >
              <Printer size={15} />
              Ordem Prod.
            </button>
            <button
              onClick={enviarWhatsApp}
              className="flex flex-col items-center gap-1 bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-green-700 text-xs py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle size={15} />
              WhatsApp
            </button>
          </div>

          {/* Editar / Salvar */}
          {editando ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditando(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="flex-1 bg-[#E87820] hover:bg-[#C96A10] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Save size={15} />
                Salvar alterações
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm py-2.5 rounded-xl"
            >
              <Edit2 size={14} />
              Editar pedido
            </button>
          )}

          {/* Contato */}
          <a
            href={`https://wa.me/55${p.telefone.replace(/\D/g, '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600"
          >
            <Phone size={12} />
            {p.telefone}
          </a>
        </div>
      </div>
    </div>
  )
}
