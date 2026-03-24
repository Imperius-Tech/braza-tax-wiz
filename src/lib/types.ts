export interface CompanyData {
  nomeEmpresa: string;
  cnpj: string;
  regimeTributario: string;
  faturamentoMensal: string;
  setor: string;
  numFuncionarios: string;
  estado: string;
  municipio: string;
  atividadePrincipal: string;
  // Campos financeiros que alimentam os agentes
  folhaPagamentoMensal: string;
  proLabore: string;
  numSocios: string;
  exportaServicos: boolean;
  percentualExportacao: string;
  observacoes: string;
}

export interface Estrategia {
  titulo: string;
  categoria: string;
  prioridade: "URGENTE" | "IMPORTANTE" | "DESEJAVEL";
  economia_estimada_anual: number;
  economia_estimada_mensal: number;
  situacao_atual: string;
  situacao_proposta: string;
  explicacao: string;
  passos_execucao: string[];
  fundamentacao_legal: string;
  complexidade: "BAIXA" | "MEDIA" | "ALTA";
  prazo_implementacao: string;
  riscos: string | null;
}

export interface ImpactoReforma {
  resumo: string;
  acoes_recomendadas: string[];
  urgencia: "ALTA" | "MEDIA" | "BAIXA";
}

export interface GlossarioItem {
  termo: string;
  definicao: string;
}

export interface FaseImplementacao {
  fase: number;
  titulo: string;
  duracao: string;
  tarefas: string[];
  mensagem_cliente: string;
  dica_relacionamento: string;
}

export interface PlanoEstrategia {
  estrategia: string;
  economia_estimada_anual: number;
  duracao_total: string;
  fases: FaseImplementacao[];
}

export interface ObjecaoResposta {
  objecao: string;
  resposta: string;
}

export interface ProtocoloFeedback {
  frequencia: string;
  canais: string[];
  modelo_relatorio_mensal: string;
  indicadores_acompanhamento: string[];
}

export interface EstrategiaRelacionamento {
  primeiro_contato: string;
  objecoes_comuns: ObjecaoResposta[];
  upsell: string;
  retencao: string;
}

export interface AnaliseResultado {
  resumo_executivo: string;
  frase_destaque: string;
  economia_total_anual: number;
  economia_total_mensal: number;
  empresa: {
    razao_social: string;
    cnpj: string | null;
    regime_tributario: string;
    faturamento_mensal: number;
    setor: string;
    municipio: string;
    estado: string;
  };
  estrategias: Estrategia[];
  glossario: GlossarioItem[] | null;
  impacto_reforma_tributaria: ImpactoReforma | null;
  plano_implementacao: PlanoEstrategia[] | null;
  protocolo_feedback: ProtocoloFeedback | null;
  estrategia_relacionamento: EstrategiaRelacionamento | null;
  disclaimer: string;
  cta: {
    texto: string;
    link: string | null;
  };
}

export interface AnaliseResponse {
  analise_id: string;
  empresa_id: string;
  resultado: AnaliseResultado;
  economia_total_estimada: number;
  num_estrategias: number;
  tempo_processamento_ms: number;
  tokens_usados: number;
}
