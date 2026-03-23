# SaaS Tributário — Imperius Tech (Caçador de Leões)

## O que é este projeto
SaaS de estratégia tributária com IA para escritórios de contabilidade. O sistema recebe dados de uma empresa (PDF + formulário), analisa com arquitetura multi-agente via OpenAI API, e gera estratégias tributárias personalizadas com economia estimada em R$.

Será demonstrado AO VIVO num webinar dia 02/04/2026. Tudo precisa funcionar perfeitamente em menos de 90 segundos.

## Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion (gerado pelo Lovable)
- **Backend:** Supabase Edge Functions (TypeScript/Deno)
- **Banco de dados:** Supabase (PostgreSQL)
- **IA:** OpenAI API (GPT-4o) — provider-agnostic para futura troca
- **Sem N8n.** Sem ferramentas no-code. Tudo via código.
- **Deploy:** Lovable (apenas deploy via GitHub push, NÃO editar na interface do Lovable)

## Estrutura do projeto
```
/src                          # Frontend React (Lovable)
/supabase
  /functions
    /analyze-company          # Edge Function principal — multi-agente
    /_shared
      /cors.ts                # Headers CORS
      /openai.ts              # Client OpenAI reutilizável
      /prompts
        /extractor.ts         # System prompt Agente 1 (Extrator)
        /strategist.ts        # System prompt Agente 2 (Estrategista)
        /formatter.ts         # System prompt Agente 3 (Formatador)
      /knowledge
        /legislacao.ts        # Legislação tributária como string
        /estrategias.ts       # Estratégias GPThales como string
  /migrations                 # SQL migrations
/estrategias_gpthales.md      # Base de conhecimento original (NÃO commitar)
/legislacao-tributaria-brasileira.md  # Legislação original (NÃO commitar)
```

## Arquitetura Multi-Agente (3 agentes sequenciais)

### Agente 1 — EXTRATOR (extrai dados estruturados)
- **Input:** PDF do cliente (base64) + dados do formulário
- **Função:** Extrair do PDF todas as informações financeiras relevantes
- **Output:** JSON estruturado com perfil completo da empresa
- **Modelo:** gpt-4o (vision para PDF)
- **Tempo alvo:** < 15 segundos

### Agente 2 — ESTRATEGISTA (gera estratégias)
- **Input:** JSON do Agente 1 + base de conhecimento (legislação + estratégias GPThales)
- **Função:** Cruzar perfil da empresa com base de conhecimento, identificar estratégias aplicáveis, calcular economia em R$
- **Output:** JSON com array de estratégias (título, categoria, economia_estimada, prioridade, explicação, passos_execução, fundamentação_legal)
- **Modelo:** gpt-4o
- **Tempo alvo:** < 45 segundos

### Agente 3 — FORMATADOR (gera relatório final)
- **Input:** JSON do Agente 2 + dados do Agente 1
- **Função:** Gerar resumo executivo, frase de destaque, organizar prioridades, formatar resultado final
- **Output:** JSON final completo para renderização no frontend
- **Modelo:** gpt-4o-mini (mais barato, tarefa simples)
- **Tempo alvo:** < 10 segundos

### Fluxo na Edge Function:
```
Frontend → POST com PDF (base64) + dados formulário
  → Agente 1 (extrator) → perfil JSON
  → Agente 2 (estrategista) com perfil + knowledge base → estratégias JSON
  → Agente 3 (formatador) com tudo → resultado final JSON
  → Salva no Supabase
  → Retorna pro frontend
```

## Base de Conhecimento
Dois arquivos na raiz do projeto (NÃO commitar):
- `estrategias_gpthales.md` — 25 estratégias tributárias práticas (158 vídeos compilados)
- `legislacao-tributaria-brasileira.md` — Legislação tributária brasileira completa

Estes arquivos são embedados como constantes TypeScript em `supabase/functions/_shared/knowledge/` e injetados no prompt do Agente 2 (Estrategista).

## Convenções de código

### TypeScript
- ES modules (import/export), nunca CommonJS
- Async/await, nunca .then() chains
- Interfaces sobre types quando possível
- Nomes de variáveis descritivos em camelCase
- Nomes de arquivos em kebab-case

### Edge Functions (Deno)
- Usar Deno.serve(), NUNCA importar serve de deno.land
- Usar Web APIs nativas (fetch, Response, Request)
- Importar dependências com prefixo npm: ou jsr:
- Variáveis de ambiente via Deno.env.get()
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY são pré-populadas
- Para outros secrets: supabase secrets set --env-file .env
- Utilitários compartilhados ficam em supabase/functions/_shared/

### React/Frontend
- Componentes funcionais com hooks
- Tailwind CSS para estilização — sem CSS modules, sem styled-components
- Shadcn/ui para componentes de UI quando disponível
- Estado local com useState/useReducer, estado global com context se necessário

### Paleta de cores Imperius
- Laranja principal: #E8640A
- Laranja hover: #D4590A
- Preto fundo: #1A1A1A
- Fundo cards: #242424
- Fundo hover: #2E2E2E
- Bordas: #333333
- Texto principal: #FFFFFF
- Texto secundário: #A0A0A0
- Sucesso/economia: #22C55E
- Alerta: #EAB308
- Urgente: #EF4444

## Banco de dados (Supabase)
Três tabelas principais:
- `empresas` — dados do formulário (razão social, CNPJ, setor, faturamento, regime tributário, município, estado, num_funcionarios, info_adicional)
- `analises` — resultados da IA (status, resultado JSONB, economia_total_estimada, num_estrategias, modelo_ia, tempo_processamento_ms, tokens_usados, erro_mensagem)
- `documentos` — metadados dos arquivos enviados (nome_arquivo, tipo_arquivo, tamanho_bytes, texto_extraido, storage_path)

RLS habilitado com policies permissivas (demo). Em produção, restringir por usuário/escritório.

## API OpenAI
- Variável de ambiente: OPENAI_API_KEY
- Setar via: supabase secrets set OPENAI_API_KEY=sk-...
- Modelo principal: gpt-4o
- Modelo formatador: gpt-4o-mini
- Endpoint: https://api.openai.com/v1/chat/completions
- Temperatura: 0.3 (baixa para precisão)
- response_format: { type: 'json_object' } para garantir JSON válido

## Frontend — 4 telas
1. **Landing/Upload** (`/`) — Formulário + upload PDF + CTA "Analisar Empresa"
2. **Processamento** (`/analysis/:id`) — Loading animado com 3 steps dos agentes
3. **Resultado** (`/result/:id`) — Economia total + cards de estratégias expandíveis
4. **Erro/404** (`*`) — Mensagem amigável + botão voltar

## Comandos úteis
```bash
supabase start                          # Iniciar Supabase local
supabase functions serve                # Servir Edge Functions localmente
supabase functions deploy analyze-company  # Deploy Edge Function
supabase secrets set OPENAI_API_KEY=sk-... # Setar secrets
supabase db push                        # Rodar migrations
```

## Regras importantes
- NUNCA usar termos técnicos na interface do usuário (ver tradução abaixo)
- O resultado da IA DEVE sempre incluir valor em R$ de economia estimada
- O resultado DEVE ser JSON válido (sem markdown, sem backticks)
- A análise precisa rodar em menos de 90 segundos (limite Edge Function free tier: 150s)
- PDFs de demo são controlados — max 2MB, formato limpo
- Dark mode obrigatório. Paleta Imperius (laranja + preto)
- Mobile-friendly — webinar será assistido por celular também
- Feedback visual SEMPRE durante processamento

### Tradução de termos técnicos (usar na UI):
- CBS/IBS → "novo sistema de impostos"
- Dashboard → "painel"
- Deploy → "colocar pra funcionar"
- ROI → "retorno do investimento"
- Agente de IA → "assistente inteligente"
- Machine Learning → "sistema que aprende sozinho"

## O que NÃO fazer
- NÃO usar N8n ou qualquer ferramenta no-code
- NÃO usar localStorage para dados sensíveis
- NÃO hardcodar a API key no código
- NÃO over-engineer — isso é MVP para demo, não produto final
- NÃO criar componentes desnecessários — mínimo viável que impressiona
- NÃO editar na interface do Lovable — só deploy via GitHub push
