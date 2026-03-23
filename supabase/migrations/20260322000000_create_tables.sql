-- Tabela de empresas (dados do formulário)
CREATE TABLE empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  razao_social TEXT NOT NULL,
  cnpj TEXT,
  setor TEXT NOT NULL,
  municipio TEXT NOT NULL,
  estado TEXT NOT NULL,
  faturamento_mensal NUMERIC NOT NULL,
  num_funcionarios INTEGER DEFAULT 0,
  regime_tributario TEXT NOT NULL,
  info_adicional TEXT
);

-- Tabela de análises
CREATE TABLE analises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'processando',
  resultado JSONB,
  economia_total_estimada NUMERIC,
  num_estrategias INTEGER DEFAULT 0,
  modelo_ia TEXT DEFAULT 'gpt-4o',
  tempo_processamento_ms INTEGER,
  tokens_usados INTEGER,
  erro_mensagem TEXT
);

-- Tabela de documentos
CREATE TABLE documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  analise_id UUID REFERENCES analises(id) ON DELETE CASCADE,
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  tamanho_bytes INTEGER,
  texto_extraido TEXT,
  storage_path TEXT
);

-- Índices
CREATE INDEX idx_analises_empresa ON analises(empresa_id);
CREATE INDEX idx_analises_status ON analises(status);
CREATE INDEX idx_documentos_analise ON documentos(analise_id);

-- RLS permissivo pra demo
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_all" ON empresas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON analises FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON documentos FOR ALL USING (true) WITH CHECK (true);
