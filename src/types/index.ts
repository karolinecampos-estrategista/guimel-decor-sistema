export type Perfil = 'gestor' | 'comercial' | 'producao'

export interface Usuario {
  id: string
  nome: string
  email: string
  perfil: Perfil
  avatar?: string
}

export type StatusLead =
  | 'novo'
  | 'em_contato'
  | 'nao_responde'
  | 'so_chamou'
  | 'orcamento_enviado'
  | 'aguardando'
  | 'convertido'
  | 'perdido'

export interface Lead {
  id: string
  nome: string
  telefone: string
  cidade?: string
  produto: TipoProduto
  ambiente?: string
  largura?: number
  altura?: number
  tecido?: string
  cor?: string
  origemAnuncio?: string
  nomeCampanha?: string
  status: StatusLead
  observacoes?: string
  dataContato: Date
  responsavel?: string
  valorEstimado?: number
}

export type TipoProduto =
  | 'persiana'
  | 'rolo'
  | 'cortina'
  | 'toldo'
  | 'papel_de_parede'

export type StatusOrcamento = 'rascunho' | 'enviado' | 'aprovado' | 'recusado'

export interface Orcamento {
  id: string
  leadId: string
  leadNome: string
  numeroOrcamento: string
  tipoProduto: TipoProduto
  ambiente?: string
  largura: number
  altura: number
  metros: number
  tecido?: string
  cor?: string
  modelo?: string
  precoM2: number
  valorProduto: number
  valorInstalacao: number
  desconto: number
  valorFinal: number
  prazoEntrega: number
  status: StatusOrcamento
  imagemSimulacaoUrl?: string
  criadoEm: Date
}

export type StatusPedido =
  | 'aguardando_producao'
  | 'em_producao'
  | 'pronto_retirada'
  | 'instalacao_agendada'
  | 'instalado'
  | 'concluido'
  | 'cancelado'

export interface Pedido {
  id: string
  numeroPedido: string
  leadId: string
  leadNome: string
  telefone: string
  orcamentoId?: string
  descricaoProduto: string
  tipoProduto: TipoProduto
  largura: number
  altura: number
  tecido?: string
  cor?: string
  modelo?: string
  valorTotal: number
  valorSinal: number
  formaSinal?: string
  valorRestante: number
  formaPagamentoFinal?: string
  dataPrevistanInstalacao?: Date
  enderecoInstalacao?: string
  cidade?: string
  status: StatusPedido
  observacoes?: string
  criadoEm: Date
  atualizadoEm: Date
  // Dados fiscais do cliente
  nomeRazaoSocial?: string
  cpf?: string
  cnpj?: string
  enderecoFiscal?: string
}

export type StatusOrdemProducao = 'pendente' | 'em_andamento' | 'pronto' | 'retirado'

export interface OrdemProducao {
  id: string
  pedidoId: string
  numeroPedido: string
  clienteNome: string
  descricao: string
  tipoProduto: TipoProduto
  largura: number
  altura: number
  tecido?: string
  cor?: string
  modelo?: string
  quantidade: number
  prazoProducao: Date
  status: StatusOrdemProducao
  materialEmEstoque: boolean
  precisaComprar: boolean
  observacoes?: string
  dataInicio?: Date
  dataConclusao?: Date
  criadoEm: Date
}

export interface ItemEstoque {
  id: string
  tipoMaterial: string
  tipoProduto?: TipoProduto
  tecido?: string
  cor?: string
  largura: number
  metragem: number
  observacoes?: string
  atualizadoEm: Date
}

export interface Instalador {
  id: string
  nome: string
  telefone: string
  pixChave?: string
  tipoChavePix?: string
  ativo: boolean
}

export type StatusInstalacao = 'agendada' | 'confirmada' | 'realizada' | 'reagendada' | 'cancelada'

export interface Instalacao {
  id: string
  pedidoId: string
  pedidoNumero: string
  clienteNome: string
  instaladorId: string
  instaladorNome: string
  dataAgendada: Date
  horaAgendada?: string
  enderecoCliente: string
  cidade?: string
  status: StatusInstalacao
  levaMaquininha: boolean
  formaCobranca?: string
  valorInstalacaoInstalador: number
  pagoAoInstalador: boolean
  observacoes?: string
  criadoEm: Date
}

export interface ContaPagar {
  id: string
  descricao: string
  fornecedor?: string
  valor: number
  dataVencimento: Date
  dataPagamento?: Date
  status: 'pendente' | 'pago' | 'atrasado'
  categoria: string
  observacoes?: string
}

export interface Pagamento {
  id: string
  pedidoId: string
  clienteNome: string
  tipo: 'entrada' | 'saldo'
  valor: number
  forma: string
  dataPagamento: Date
  confirmado: boolean
}

export interface MetricaAnuncio {
  id: string
  data: Date
  plataforma: 'meta_ads' | 'tiktok_ads' | 'organico'
  nomeCampanha: string
  nomeAnuncio: string
  investimento: number
  impressoes: number
  cliques: number
  mensagens: number
  conversoes: number
  receitaGerada: number
}
