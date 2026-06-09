import type {
  Usuario, Lead, Orcamento, Pedido, OrdemProducao,
  ItemEstoque, Instalador, Instalacao, ContaPagar,
  Pagamento, MetricaAnuncio
} from '@/types'
import { subDays, addDays, subMonths } from 'date-fns'

const hoje = new Date()

// ─── USUÁRIOS ────────────────────────────────────────────────────────────────
export const mockUsuarios: Usuario[] = [
  { id: 'u1', nome: 'Karoline Campos', email: 'karoline@guimel.com.br', perfil: 'gestor' },
  { id: 'u2', nome: 'Fernanda Lima', email: 'fernanda@guimel.com.br', perfil: 'comercial' },
  { id: 'u3', nome: 'Roberto Santos', email: 'roberto@guimel.com.br', perfil: 'producao' },
  { id: 'u4', nome: 'Tiago Campos', email: 'tiago@guimel.com.br', perfil: 'gestor' },
]

// ─── LEADS ────────────────────────────────────────────────────────────────────
export const mockLeads: Lead[] = [
  { id: 'l1', nome: 'Ana Paula Ribeiro', telefone: '11 98765-4321', cidade: 'São Paulo', produto: 'persiana', ambiente: 'dormitório', largura: 1.8, altura: 2.1, tecido: 'Double Vision', cor: 'Bege', origemAnuncio: 'Meta Ads', nomeCampanha: 'Persiana Blackout - SP', status: 'novo', dataContato: subDays(hoje, 0), valorEstimado: 820 },
  { id: 'l2', nome: 'Marcos Oliveira', telefone: '11 99123-4567', cidade: 'Santo André', produto: 'rolo', ambiente: 'sala', largura: 2.5, altura: 2.2, tecido: 'Blackout', cor: 'Cinza', origemAnuncio: 'Meta Ads', nomeCampanha: 'Rolo Blackout - ABC', status: 'novo', dataContato: subDays(hoje, 1), valorEstimado: 680 },
  { id: 'l3', nome: 'Juliana Costa', telefone: '11 97654-3210', cidade: 'São Bernardo', produto: 'cortina', ambiente: 'sala', largura: 3.0, altura: 2.5, tecido: 'Linho', cor: 'Branco', origemAnuncio: 'TikTok Ads', nomeCampanha: 'Cortina Elegante', status: 'em_contato', dataContato: subDays(hoje, 1), valorEstimado: 1240 },
  { id: 'l4', nome: 'Pedro Almeida', telefone: '11 98888-1234', cidade: 'São Paulo', produto: 'persiana', ambiente: 'escritório', largura: 2.0, altura: 2.0, tecido: 'Double Vision', cor: 'Branco', origemAnuncio: 'Meta Ads', nomeCampanha: 'Persiana Blackout - SP', status: 'em_contato', dataContato: subDays(hoje, 2), valorEstimado: 760 },
  { id: 'l5', nome: 'Carla Fernandes', telefone: '11 96543-2109', cidade: 'Guarulhos', produto: 'papel_de_parede', ambiente: 'dormitório', origemAnuncio: 'Instagram Orgânico', nomeCampanha: 'Orgânico', status: 'orcamento_enviado', dataContato: subDays(hoje, 3), valorEstimado: 1850 },
  { id: 'l6', nome: 'Bruno Martins', telefone: '11 95432-1098', cidade: 'São Paulo', produto: 'toldo', ambiente: 'comercial', largura: 4.0, altura: 3.0, origemAnuncio: 'Meta Ads', nomeCampanha: 'Toldo Comercial SP', status: 'orcamento_enviado', dataContato: subDays(hoje, 4), valorEstimado: 3200 },
  { id: 'l7', nome: 'Lucia Santos', telefone: '11 94321-0987', cidade: 'Santo André', produto: 'rolo', ambiente: 'dormitório', largura: 1.6, altura: 2.0, tecido: 'Blackout', cor: 'Bege', origemAnuncio: 'TikTok Ads', nomeCampanha: 'Cortina Elegante', status: 'aguardando', dataContato: subDays(hoje, 5), valorEstimado: 520 },
  { id: 'l8', nome: 'Ricardo Souza', telefone: '11 93210-9876', cidade: 'São Paulo', produto: 'cortina', ambiente: 'sala', largura: 3.5, altura: 2.6, tecido: 'Blackout Duplex', cor: 'Cinza', origemAnuncio: 'Meta Ads', nomeCampanha: 'Rolo Blackout - ABC', status: 'aguardando', dataContato: subDays(hoje, 6), valorEstimado: 1580 },
  { id: 'l9', nome: 'Camila Pereira', telefone: '11 92109-8765', cidade: 'São Paulo', produto: 'persiana', ambiente: 'dormitório', largura: 1.5, altura: 2.0, tecido: 'Double Vision', cor: 'Cappuccino', origemAnuncio: 'Meta Ads', nomeCampanha: 'Persiana Blackout - SP', status: 'convertido', dataContato: subDays(hoje, 8), valorEstimado: 680 },
  { id: 'l10', nome: 'Thiago Lima', telefone: '11 91098-7654', cidade: 'São Bernardo', produto: 'rolo', ambiente: 'sala', largura: 2.2, altura: 2.1, tecido: 'Solar Screen', cor: 'Branco', origemAnuncio: 'TikTok Ads', nomeCampanha: 'Cortina Elegante', status: 'convertido', dataContato: subDays(hoje, 10), valorEstimado: 920 },
  { id: 'l11', nome: 'Patrícia Gomes', telefone: '11 90987-6543', cidade: 'Guarulhos', produto: 'cortina', ambiente: 'dormitório', largura: 2.8, altura: 2.4, tecido: 'Veludo', cor: 'Verde', origemAnuncio: 'Meta Ads', nomeCampanha: 'Cortina Elegante', status: 'convertido', dataContato: subDays(hoje, 12), valorEstimado: 1920 },
  { id: 'l12', nome: 'Diego Castro', telefone: '11 89876-5432', cidade: 'São Paulo', produto: 'persiana', ambiente: 'sala', origemAnuncio: 'Meta Ads', nomeCampanha: 'Persiana Blackout - SP', status: 'perdido', dataContato: subDays(hoje, 15), observacoes: 'Achou caro, foi com concorrente' },
  { id: 'l13', nome: 'Isabela Torres', telefone: '11 78765-4321', cidade: 'Santo André', produto: 'rolo', ambiente: 'escritório', origemAnuncio: 'TikTok Ads', nomeCampanha: 'Cortina Elegante', status: 'perdido', dataContato: subDays(hoje, 18), observacoes: 'Não retornou mais' },
  { id: 'l14', nome: 'Fabio Nunes', telefone: '11 67654-3210', cidade: 'São Paulo', produto: 'toldo', ambiente: 'comercial', largura: 3.0, origemAnuncio: 'Meta Ads', nomeCampanha: 'Toldo Comercial SP', status: 'em_contato', dataContato: subDays(hoje, 0), valorEstimado: 2800 },
  { id: 'l15', nome: 'Renata Dias', telefone: '11 56543-2109', cidade: 'São Paulo', produto: 'papel_de_parede', ambiente: 'sala', origemAnuncio: 'Instagram Orgânico', nomeCampanha: 'Orgânico', status: 'orcamento_enviado', dataContato: subDays(hoje, 2), valorEstimado: 2200 },
  { id: 'l16', nome: 'Vanessa Rocha', telefone: '11 45432-1234', cidade: 'São Paulo', produto: 'persiana', ambiente: 'dormitório', origemAnuncio: 'Meta Ads', nomeCampanha: 'Persiana Blackout - SP', status: 'nao_responde', dataContato: subDays(hoje, 7), valorEstimado: 740, observacoes: 'Respondeu 1x, depois sumiu' },
  { id: 'l17', nome: 'Gustavo Barros', telefone: '11 34321-9876', cidade: 'Santo André', produto: 'rolo', ambiente: 'sala', origemAnuncio: 'TikTok Ads', nomeCampanha: 'Cortina Elegante', status: 'nao_responde', dataContato: subDays(hoje, 9), valorEstimado: 650, observacoes: 'Deixou em visto' },
  { id: 'l18', nome: 'Aline Cardoso', telefone: '11 23210-8765', cidade: 'Guarulhos', produto: 'cortina', ambiente: 'sala', origemAnuncio: 'Meta Ads', nomeCampanha: 'Rolo Blackout - ABC', status: 'so_chamou', dataContato: subDays(hoje, 4), observacoes: 'Ligou, não atendemos. Retornamos, não atendeu.' },
  { id: 'l19', nome: 'Marcelo Teixeira', telefone: '11 12109-7654', cidade: 'São Paulo', produto: 'toldo', origemAnuncio: 'Meta Ads', nomeCampanha: 'Toldo Comercial SP', status: 'so_chamou', dataContato: subDays(hoje, 6), observacoes: 'Mandou msg "oi", não respondeu mais' },
]

// ─── ORÇAMENTOS ───────────────────────────────────────────────────────────────
export const mockOrcamentos: Orcamento[] = [
  { id: 'o1', leadId: 'l5', leadNome: 'Carla Fernandes', numeroOrcamento: 'ORC-2025-001', tipoProduto: 'papel_de_parede', ambiente: 'Dormitório', largura: 4.2, altura: 2.6, metros: 10.92, tecido: 'Vinílico Texturizado', cor: 'Areia', modelo: 'Premium', precoM2: 145, valorProduto: 1583.40, valorInstalacao: 350, desconto: 5, valorFinal: 1754.23, prazoEntrega: 10, status: 'enviado', criadoEm: subDays(hoje, 3) },
  { id: 'o2', leadId: 'l6', leadNome: 'Bruno Martins', numeroOrcamento: 'ORC-2025-002', tipoProduto: 'toldo', ambiente: 'Comercial', largura: 4.0, altura: 3.0, metros: 12, tecido: 'Acrílico 100%', cor: 'Azul Marinho', modelo: 'Articulado', precoM2: 220, valorProduto: 2640, valorInstalacao: 480, desconto: 0, valorFinal: 3120, prazoEntrega: 15, status: 'enviado', criadoEm: subDays(hoje, 4) },
  { id: 'o3', leadId: 'l9', leadNome: 'Camila Pereira', numeroOrcamento: 'ORC-2025-003', tipoProduto: 'persiana', ambiente: 'Dormitório', largura: 1.5, altura: 2.0, metros: 3, tecido: 'Double Vision', cor: 'Cappuccino', modelo: 'Standard', precoM2: 185, valorProduto: 555, valorInstalacao: 120, desconto: 0, valorFinal: 675, prazoEntrega: 7, status: 'aprovado', criadoEm: subDays(hoje, 8) },
  { id: 'o4', leadId: 'l10', leadNome: 'Thiago Lima', numeroOrcamento: 'ORC-2025-004', tipoProduto: 'rolo', ambiente: 'Sala', largura: 2.2, altura: 2.1, metros: 4.62, tecido: 'Solar Screen', cor: 'Branco', modelo: 'Blackout', precoM2: 168, valorProduto: 776.16, valorInstalacao: 150, desconto: 0, valorFinal: 926.16, prazoEntrega: 7, status: 'aprovado', criadoEm: subDays(hoje, 10) },
  { id: 'o5', leadId: 'l11', leadNome: 'Patrícia Gomes', numeroOrcamento: 'ORC-2025-005', tipoProduto: 'cortina', ambiente: 'Dormitório', largura: 2.8, altura: 2.4, metros: 6.72, tecido: 'Veludo', cor: 'Verde Musgo', modelo: 'Blackout', precoM2: 240, valorProduto: 1612.80, valorInstalacao: 280, desconto: 0, valorFinal: 1892.80, prazoEntrega: 12, status: 'aprovado', criadoEm: subDays(hoje, 12) },
  { id: 'o6', leadId: 'l15', leadNome: 'Renata Dias', numeroOrcamento: 'ORC-2025-006', tipoProduto: 'papel_de_parede', ambiente: 'Sala', largura: 3.8, altura: 2.6, metros: 9.88, tecido: 'Não tecido', cor: 'Cinza Claro', modelo: 'Geométrico', precoM2: 198, valorProduto: 1956.24, valorInstalacao: 320, desconto: 0, valorFinal: 2276.24, prazoEntrega: 10, status: 'enviado', criadoEm: subDays(hoje, 2) },
]

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────
export const mockPedidos: Pedido[] = [
  { id: 'p1', numeroPedido: 'PED-2025-001', leadId: 'l9', leadNome: 'Camila Pereira', telefone: '11 92109-8765', orcamentoId: 'o3', descricaoProduto: 'Persiana Double Vision Cappuccino 1,5×2,0m', tipoProduto: 'persiana', largura: 1.5, altura: 2.0, tecido: 'Double Vision', cor: 'Cappuccino', modelo: 'Standard', valorTotal: 675, valorSinal: 337.50, formaSinal: 'pix', valorRestante: 337.50, formaPagamentoFinal: 'pix', dataPrevistanInstalacao: addDays(hoje, 3), enderecoInstalacao: 'Rua das Flores, 123', cidade: 'São Paulo', status: 'pronto_retirada', criadoEm: subDays(hoje, 8), atualizadoEm: subDays(hoje, 2) },
  { id: 'p2', numeroPedido: 'PED-2025-002', leadId: 'l10', leadNome: 'Thiago Lima', telefone: '11 91098-7654', orcamentoId: 'o4', descricaoProduto: 'Rolo Solar Screen Branco 2,2×2,1m', tipoProduto: 'rolo', largura: 2.2, altura: 2.1, tecido: 'Solar Screen', cor: 'Branco', modelo: 'Blackout', valorTotal: 926.16, valorSinal: 463.08, formaSinal: 'transferencia', valorRestante: 463.08, formaPagamentoFinal: 'maquininha', dataPrevistanInstalacao: addDays(hoje, 5), enderecoInstalacao: 'Av. Brasil, 456', cidade: 'São Bernardo', status: 'instalacao_agendada', criadoEm: subDays(hoje, 10), atualizadoEm: subDays(hoje, 1) },
  { id: 'p3', numeroPedido: 'PED-2025-003', leadId: 'l11', leadNome: 'Patrícia Gomes', telefone: '11 90987-6543', orcamentoId: 'o5', descricaoProduto: 'Cortina Veludo Verde Musgo 2,8×2,4m', tipoProduto: 'cortina', largura: 2.8, altura: 2.4, tecido: 'Veludo', cor: 'Verde Musgo', modelo: 'Blackout', valorTotal: 1892.80, valorSinal: 946.40, formaSinal: 'pix', valorRestante: 946.40, formaPagamentoFinal: 'maquininha', dataPrevistanInstalacao: addDays(hoje, 8), enderecoInstalacao: 'Rua Ipiranga, 789', cidade: 'Guarulhos', status: 'em_producao', criadoEm: subDays(hoje, 12), atualizadoEm: subDays(hoje, 4) },
  { id: 'p4', numeroPedido: 'PED-2025-004', leadId: 'l3', leadNome: 'Juliana Costa', telefone: '11 97654-3210', descricaoProduto: 'Cortina Linho Branco 3,0×2,5m', tipoProduto: 'cortina', largura: 3.0, altura: 2.5, tecido: 'Linho', cor: 'Branco', valorTotal: 1240, valorSinal: 620, formaSinal: 'pix', valorRestante: 620, formaPagamentoFinal: 'pix', dataPrevistanInstalacao: addDays(hoje, 12), enderecoInstalacao: 'Rua Augusta, 321', cidade: 'São Bernardo', status: 'aguardando_producao', criadoEm: subDays(hoje, 3), atualizadoEm: subDays(hoje, 1) },
  { id: 'p5', numeroPedido: 'PED-2025-005', leadId: 'l4', leadNome: 'Pedro Almeida', telefone: '11 98888-1234', descricaoProduto: 'Persiana Double Vision Branco 2,0×2,0m', tipoProduto: 'persiana', largura: 2.0, altura: 2.0, tecido: 'Double Vision', cor: 'Branco', valorTotal: 760, valorSinal: 380, formaSinal: 'maquininha', valorRestante: 380, formaPagamentoFinal: 'pix', dataPrevistanInstalacao: addDays(hoje, 15), enderecoInstalacao: 'Av. Paulista, 1000', cidade: 'São Paulo', status: 'aguardando_producao', criadoEm: subDays(hoje, 2), atualizadoEm: subDays(hoje, 2) },
  { id: 'p6', numeroPedido: 'PED-2025-006', leadId: 'l7', leadNome: 'Lucia Santos', telefone: '11 94321-0987', descricaoProduto: 'Rolo Blackout Bege 1,6×2,0m', tipoProduto: 'rolo', largura: 1.6, altura: 2.0, tecido: 'Blackout', cor: 'Bege', valorTotal: 520, valorSinal: 520, formaSinal: 'pix', valorRestante: 0, formaPagamentoFinal: 'pago', dataPrevistanInstalacao: subDays(hoje, 2), enderecoInstalacao: 'Rua das Palmeiras, 55', cidade: 'Santo André', status: 'concluido', criadoEm: subDays(hoje, 20), atualizadoEm: subDays(hoje, 2) },
]

// ─── ORDENS DE PRODUÇÃO ───────────────────────────────────────────────────────
export const mockOrdens: OrdemProducao[] = [
  { id: 'op1', pedidoId: 'p3', numeroPedido: 'PED-2025-003', clienteNome: 'Patrícia Gomes', descricao: 'Cortina Veludo Verde Musgo com blackout - 2 folhas', tipoProduto: 'cortina', largura: 2.8, altura: 2.4, tecido: 'Veludo', cor: 'Verde Musgo', modelo: 'Blackout', quantidade: 1, prazoProducao: addDays(hoje, 6), status: 'em_andamento', materialEmEstoque: true, precisaComprar: false, criadoEm: subDays(hoje, 4) },
  { id: 'op2', pedidoId: 'p1', numeroPedido: 'PED-2025-001', clienteNome: 'Camila Pereira', descricao: 'Persiana Double Vision Cappuccino', tipoProduto: 'persiana', largura: 1.5, altura: 2.0, tecido: 'Double Vision', cor: 'Cappuccino', modelo: 'Standard', quantidade: 1, prazoProducao: subDays(hoje, 1), status: 'pronto', materialEmEstoque: true, precisaComprar: false, criadoEm: subDays(hoje, 7) },
  { id: 'op3', pedidoId: 'p4', numeroPedido: 'PED-2025-004', clienteNome: 'Juliana Costa', descricao: 'Cortina Linho Branco - 2 painéis', tipoProduto: 'cortina', largura: 3.0, altura: 2.5, tecido: 'Linho', cor: 'Branco', modelo: 'Com forro', quantidade: 2, prazoProducao: addDays(hoje, 9), status: 'pendente', materialEmEstoque: false, precisaComprar: true, observacoes: 'Aguardando chegada do tecido - previsão 3 dias', criadoEm: subDays(hoje, 1) },
  { id: 'op4', pedidoId: 'p5', numeroPedido: 'PED-2025-005', clienteNome: 'Pedro Almeida', descricao: 'Persiana Double Vision Branco - escritório', tipoProduto: 'persiana', largura: 2.0, altura: 2.0, tecido: 'Double Vision', cor: 'Branco', modelo: 'Standard', quantidade: 1, prazoProducao: addDays(hoje, 12), status: 'pendente', materialEmEstoque: true, precisaComprar: false, criadoEm: subDays(hoje, 2) },
  { id: 'op5', pedidoId: 'p6', numeroPedido: 'PED-2025-006', clienteNome: 'Lucia Santos', descricao: 'Rolo Blackout Bege', tipoProduto: 'rolo', largura: 1.6, altura: 2.0, tecido: 'Blackout', cor: 'Bege', modelo: 'Blackout Total', quantidade: 1, prazoProducao: subDays(hoje, 5), status: 'retirado', materialEmEstoque: true, precisaComprar: false, criadoEm: subDays(hoje, 18) },
]

// ─── ESTOQUE ─────────────────────────────────────────────────────────────────
export const mockEstoque: ItemEstoque[] = [
  { id: 'e1', tipoMaterial: 'Tecido', tipoProduto: 'persiana', tecido: 'Double Vision', cor: 'Branco', largura: 250, metragem: 18.5, atualizadoEm: subDays(hoje, 1) },
  { id: 'e2', tipoMaterial: 'Tecido', tipoProduto: 'persiana', tecido: 'Double Vision', cor: 'Cappuccino', largura: 250, metragem: 6.2, atualizadoEm: subDays(hoje, 1) },
  { id: 'e3', tipoMaterial: 'Tecido', tipoProduto: 'persiana', tecido: 'Double Vision', cor: 'Bege', largura: 250, metragem: 4.8, atualizadoEm: subDays(hoje, 3) },
  { id: 'e4', tipoMaterial: 'Tecido', tipoProduto: 'rolo', tecido: 'Blackout', cor: 'Branco', largura: 300, metragem: 22.0, atualizadoEm: subDays(hoje, 2) },
  { id: 'e5', tipoMaterial: 'Tecido', tipoProduto: 'rolo', tecido: 'Blackout', cor: 'Bege', largura: 300, metragem: 3.4, atualizadoEm: subDays(hoje, 4) },
  { id: 'e6', tipoMaterial: 'Tecido', tipoProduto: 'rolo', tecido: 'Solar Screen', cor: 'Branco', largura: 280, metragem: 12.6, atualizadoEm: subDays(hoje, 2) },
  { id: 'e7', tipoMaterial: 'Tecido', tipoProduto: 'cortina', tecido: 'Veludo', cor: 'Verde Musgo', largura: 280, metragem: 7.8, atualizadoEm: subDays(hoje, 5) },
  { id: 'e8', tipoMaterial: 'Tecido', tipoProduto: 'cortina', tecido: 'Linho', cor: 'Branco', largura: 300, metragem: 0.8, observacoes: 'Compra solicitada', atualizadoEm: subDays(hoje, 1) },
  { id: 'e9', tipoMaterial: 'Tecido', tipoProduto: 'cortina', tecido: 'Blackout Duplex', cor: 'Cinza', largura: 300, metragem: 15.0, atualizadoEm: subDays(hoje, 6) },
  { id: 'e10', tipoMaterial: 'Trilho', tipoProduto: 'cortina', tecido: 'Trilho Suíço', cor: 'Branco', largura: 300, metragem: 45, atualizadoEm: subDays(hoje, 7) },
]

// ─── INSTALADORES ─────────────────────────────────────────────────────────────
export const mockInstaladores: Instalador[] = [
  { id: 'i1', nome: 'João Carlos Silva', telefone: '11 97777-8888', pixChave: '11977778888', tipoChavePix: 'telefone', ativo: true },
  { id: 'i2', nome: 'Pedro Henrique Costa', telefone: '11 96666-7777', pixChave: 'pedro.instalador@gmail.com', tipoChavePix: 'email', ativo: true },
  { id: 'i3', nome: 'Marcos Antônio Lima', telefone: '11 95555-6666', pixChave: '123.456.789-00', tipoChavePix: 'cpf', ativo: true },
]

// ─── INSTALAÇÕES ──────────────────────────────────────────────────────────────
export const mockIntalacoes: Instalacao[] = [
  { id: 'in1', pedidoId: 'p1', pedidoNumero: 'PED-2025-001', clienteNome: 'Camila Pereira', instaladorId: 'i1', instaladorNome: 'João Carlos Silva', dataAgendada: addDays(hoje, 3), horaAgendada: '09:00', enderecoCliente: 'Rua das Flores, 123, Ap 42', cidade: 'São Paulo', status: 'confirmada', levaMaquininha: false, formaCobranca: 'pix', valorInstalacaoInstalador: 80, pagoAoInstalador: false, criadoEm: subDays(hoje, 5) },
  { id: 'in2', pedidoId: 'p2', pedidoNumero: 'PED-2025-002', clienteNome: 'Thiago Lima', instaladorId: 'i2', instaladorNome: 'Pedro Henrique Costa', dataAgendada: addDays(hoje, 5), horaAgendada: '14:00', enderecoCliente: 'Av. Brasil, 456', cidade: 'São Bernardo', status: 'agendada', levaMaquininha: true, formaCobranca: 'maquininha', valorInstalacaoInstalador: 80, pagoAoInstalador: false, criadoEm: subDays(hoje, 3) },
  { id: 'in3', pedidoId: 'p6', pedidoNumero: 'PED-2025-006', clienteNome: 'Lucia Santos', instaladorId: 'i1', instaladorNome: 'João Carlos Silva', dataAgendada: subDays(hoje, 2), horaAgendada: '10:00', enderecoCliente: 'Rua das Palmeiras, 55', cidade: 'Santo André', status: 'realizada', levaMaquininha: false, formaCobranca: 'pago', valorInstalacaoInstalador: 60, pagoAoInstalador: false, criadoEm: subDays(hoje, 10) },
  { id: 'in4', pedidoId: 'p3', pedidoNumero: 'PED-2025-003', clienteNome: 'Patrícia Gomes', instaladorId: 'i3', instaladorNome: 'Marcos Antônio Lima', dataAgendada: addDays(hoje, 8), horaAgendada: '09:00', enderecoCliente: 'Rua Ipiranga, 789', cidade: 'Guarulhos', status: 'agendada', levaMaquininha: true, formaCobranca: 'maquininha', valorInstalacaoInstalador: 120, pagoAoInstalador: false, criadoEm: subDays(hoje, 1) },
]

// ─── CONTAS A PAGAR ───────────────────────────────────────────────────────────
export const mockContasPagar: ContaPagar[] = [
  { id: 'cp1', descricao: 'Instaladores - semana 19/05 a 23/05', fornecedor: 'João Carlos + Pedro + Marcos', valor: 2100, dataVencimento: addDays(hoje, 4), categoria: 'instalador', status: 'pendente' },
  { id: 'cp2', descricao: 'Tecidos Linho e Veludo', fornecedor: 'Distribuidora Têxtil São Paulo', valor: 2840, dataVencimento: addDays(hoje, 1), categoria: 'material', status: 'pendente' },
  { id: 'cp3', descricao: 'Aluguel ateliê - Maio/2025', fornecedor: 'Imobiliária Central', valor: 1800, dataVencimento: addDays(hoje, 8), categoria: 'aluguel', status: 'pendente' },
  { id: 'cp4', descricao: 'Meta Ads - Campanhas Maio', fornecedor: 'Meta Platforms', valor: 1200, dataVencimento: addDays(hoje, 12), categoria: 'marketing', status: 'pendente' },
  { id: 'cp5', descricao: 'Material de escritório', fornecedor: 'Office Total', valor: 340, dataVencimento: subDays(hoje, 2), categoria: 'outros', status: 'atrasado' },
  { id: 'cp6', descricao: 'Tecidos Blackout - Reposição', fornecedor: 'Distribuidora Têxtil São Paulo', valor: 1560, dataVencimento: subDays(hoje, 5), categoria: 'material', status: 'pago', dataPagamento: subDays(hoje, 6) },
  { id: 'cp7', descricao: 'TikTok Ads - Campanhas Abril', fornecedor: 'TikTok for Business', valor: 800, dataVencimento: subDays(hoje, 15), categoria: 'marketing', status: 'pago', dataPagamento: subDays(hoje, 14) },
]

// ─── PAGAMENTOS RECEBIDOS ─────────────────────────────────────────────────────
export const mockPagamentos: Pagamento[] = [
  { id: 'pg1', pedidoId: 'p1', clienteNome: 'Camila Pereira', tipo: 'entrada', valor: 337.50, forma: 'pix', dataPagamento: subDays(hoje, 7), confirmado: true },
  { id: 'pg2', pedidoId: 'p2', clienteNome: 'Thiago Lima', tipo: 'entrada', valor: 463.08, forma: 'transferencia', dataPagamento: subDays(hoje, 9), confirmado: true },
  { id: 'pg3', pedidoId: 'p3', clienteNome: 'Patrícia Gomes', tipo: 'entrada', valor: 946.40, forma: 'pix', dataPagamento: subDays(hoje, 11), confirmado: true },
  { id: 'pg4', pedidoId: 'p4', clienteNome: 'Juliana Costa', tipo: 'entrada', valor: 620, forma: 'pix', dataPagamento: subDays(hoje, 2), confirmado: true },
  { id: 'pg5', pedidoId: 'p5', clienteNome: 'Pedro Almeida', tipo: 'entrada', valor: 380, forma: 'maquininha', dataPagamento: subDays(hoje, 1), confirmado: true },
  { id: 'pg6', pedidoId: 'p6', clienteNome: 'Lucia Santos', tipo: 'entrada', valor: 520, forma: 'pix', dataPagamento: subDays(hoje, 19), confirmado: true },
  { id: 'pg7', pedidoId: 'p6', clienteNome: 'Lucia Santos', tipo: 'saldo', valor: 0, forma: 'pago', dataPagamento: subDays(hoje, 2), confirmado: true },
]

// ─── MÉTRICAS DE ANÚNCIOS ────────────────────────────────────────────────────
export const mockMetricas: MetricaAnuncio[] = [
  { id: 'm1', data: subDays(hoje, 6), plataforma: 'meta_ads', nomeCampanha: 'Persiana Blackout - SP', nomeAnuncio: 'Antes/Depois Persiana', investimento: 85, impressoes: 12400, cliques: 420, mensagens: 8, conversoes: 2, receitaGerada: 1350 },
  { id: 'm2', data: subDays(hoje, 5), plataforma: 'meta_ads', nomeCampanha: 'Persiana Blackout - SP', nomeAnuncio: 'Antes/Depois Persiana', investimento: 85, impressoes: 11800, cliques: 390, mensagens: 6, conversoes: 1, receitaGerada: 680 },
  { id: 'm3', data: subDays(hoje, 4), plataforma: 'tiktok_ads', nomeCampanha: 'Cortina Elegante', nomeAnuncio: 'Video Instalação Cortina', investimento: 60, impressoes: 18200, cliques: 580, mensagens: 5, conversoes: 1, receitaGerada: 926 },
  { id: 'm4', data: subDays(hoje, 3), plataforma: 'meta_ads', nomeCampanha: 'Rolo Blackout - ABC', nomeAnuncio: 'Promoção Rolo Dia/Noite', investimento: 90, impressoes: 14600, cliques: 310, mensagens: 4, conversoes: 0, receitaGerada: 0 },
  { id: 'm5', data: subDays(hoje, 2), plataforma: 'meta_ads', nomeCampanha: 'Toldo Comercial SP', nomeAnuncio: 'Toldo para Comercio', investimento: 120, impressoes: 8400, cliques: 180, mensagens: 3, conversoes: 1, receitaGerada: 3120 },
  { id: 'm6', data: subDays(hoje, 1), plataforma: 'tiktok_ads', nomeCampanha: 'Cortina Elegante', nomeAnuncio: 'Ambiente Transformado', investimento: 60, impressoes: 22000, cliques: 680, mensagens: 7, conversoes: 1, receitaGerada: 1893 },
  { id: 'm7', data: hoje, plataforma: 'meta_ads', nomeCampanha: 'Persiana Blackout - SP', nomeAnuncio: 'Antes/Depois Persiana', investimento: 85, impressoes: 9200, cliques: 310, mensagens: 5, conversoes: 0, receitaGerada: 0 },
]

export const mockUsuarioLogado: Usuario = mockUsuarios[0]
