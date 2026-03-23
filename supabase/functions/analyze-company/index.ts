import { corsHeaders } from "../_shared/cors.ts";
import { chatCompletion } from "../_shared/openai.ts";
import { EXTRACTOR_SYSTEM_PROMPT } from "../_shared/prompts/extractor.ts";
import { STRATEGIST_SYSTEM_PROMPT } from "../_shared/prompts/strategist.ts";
import { FORMATTER_SYSTEM_PROMPT } from "../_shared/prompts/formatter.ts";
import { LEGISLACAO_TRIBUTARIA } from "../_shared/knowledge/legislacao.ts";
import { ESTRATEGIAS_GPTHALES } from "../_shared/knowledge/estrategias.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Validar knowledge base na inicialização
if (!LEGISLACAO_TRIBUTARIA || LEGISLACAO_TRIBUTARIA.length < 500) {
  console.error("ALERTA: Legislação tributária não carregada ou vazia!");
}
if (!ESTRATEGIAS_GPTHALES || ESTRATEGIAS_GPTHALES.length < 500) {
  console.error("ALERTA: Estratégias GPThales não carregadas ou vazias!");
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  let analiseId: string | null = null;

  try {
    const { empresa, documento_base64, documento_nome } = await req.json();

    if (!empresa || !empresa.nomeEmpresa || !empresa.regimeTributario) {
      return new Response(
        JSON.stringify({ error: "Dados da empresa incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validar faturamento
    const faturamentoLimpo = empresa.faturamentoMensal
      ?.replace(/[^\d,.-]/g, "")
      .replace(",", ".");
    const faturamento = parseFloat(faturamentoLimpo);
    if (!faturamento || isNaN(faturamento) || faturamento <= 0) {
      return new Response(
        JSON.stringify({ error: "Faturamento mensal inválido. Informe um valor positivo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Salvar empresa no Supabase
    const { data: empresaData, error: empresaError } = await supabase
      .from("empresas")
      .insert({
        razao_social: empresa.nomeEmpresa,
        cnpj: empresa.cnpj || null,
        setor: empresa.setor,
        municipio: empresa.municipio || "Não informado",
        estado: empresa.estado,
        faturamento_mensal: faturamento,
        num_funcionarios: parseInt(empresa.numFuncionarios) || 0,
        regime_tributario: empresa.regimeTributario,
        info_adicional: JSON.stringify({
          atividade_principal: empresa.atividadePrincipal || null,
          folha_pagamento_mensal: empresa.folhaPagamentoMensal || null,
          pro_labore: empresa.proLabore || null,
          num_socios: empresa.numSocios || null,
          exporta_servicos: empresa.exportaServicos || false,
          percentual_exportacao: empresa.percentualExportacao || null,
          observacoes: empresa.observacoes || null,
        }),
      })
      .select("id")
      .single();

    if (empresaError) throw new Error(`Erro ao salvar empresa: ${empresaError.message}`);
    const empresaId = empresaData.id;

    // 2. Criar análise com status 'processando'
    const { data: analiseData, error: analiseError } = await supabase
      .from("analises")
      .insert({
        empresa_id: empresaId,
        status: "processando",
        modelo_ia: "gpt-4o",
      })
      .select("id")
      .single();

    if (analiseError) throw new Error(`Erro ao criar análise: ${analiseError.message}`);
    analiseId = analiseData.id;

    // 3. Se tem documento, salvar referência
    if (documento_base64 && documento_nome) {
      const { error: docError } = await supabase.from("documentos").insert({
        analise_id: analiseId,
        nome_arquivo: documento_nome,
        tipo_arquivo: "application/pdf",
        tamanho_bytes: Math.round((documento_base64.length * 3) / 4),
      });
      if (docError) console.warn("Erro ao salvar documento:", docError.message);
    }

    let totalTokens = 0;

    // ==========================================
    // AGENTE 1 — EXTRATOR
    // ==========================================
    console.log("[Agente 1] Extrator iniciado...");
    const t1 = Date.now();

    const dadosFormulario = `
Dados do formulário:
- Razão Social: ${empresa.nomeEmpresa}
- CNPJ: ${empresa.cnpj || "Não informado"}
- Setor: ${empresa.setor}
- Estado: ${empresa.estado}
- Município: ${empresa.municipio || "Não informado"}
- Faturamento Mensal: R$ ${empresa.faturamentoMensal}
- Folha de Pagamento Mensal: R$ ${empresa.folhaPagamentoMensal || "Não informado"}
- Pró-labore Total dos Sócios: R$ ${empresa.proLabore || "Não informado"}
- Número de Sócios: ${empresa.numSocios || "Não informado"}
- Número de Funcionários (CLT): ${empresa.numFuncionarios || "0"}
- Regime Tributário: ${empresa.regimeTributario}
- Atividade Principal: ${empresa.atividadePrincipal || "Não informada"}
- Exporta Serviços/Produtos: ${empresa.exportaServicos ? `Sim (${empresa.percentualExportacao || "?"}% da receita)` : "Não"}
- Observações: ${empresa.observacoes || "Nenhuma"}
    `.trim();

    const userContentExtractor: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

    if (documento_base64) {
      userContentExtractor.push({
        type: "image_url",
        image_url: { url: `data:application/pdf;base64,${documento_base64}` },
      });
      userContentExtractor.push({
        type: "text",
        text: `Extraia todos os dados financeiros e tributários deste documento e retorne em formato json.\n\n${dadosFormulario}`,
      });
    } else {
      userContentExtractor.push({
        type: "text",
        text: `Não há documento PDF anexo. Analise apenas os dados do formulário e faça estimativas razoáveis baseadas no setor e porte. Retorne em formato json.\n\n${dadosFormulario}`,
      });
    }

    const extractorResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: EXTRACTOR_SYSTEM_PROMPT },
        { role: "user", content: userContentExtractor },
      ],
      temperature: 0.2,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      timeout_ms: 30000,
    });

    const perfilEmpresa = extractorResponse.choices[0].message.content;
    totalTokens += extractorResponse.usage.total_tokens;
    console.log(`[Agente 1] Extrator concluído em ${Date.now() - t1}ms`);

    // Validar output do Extrator
    try {
      JSON.parse(perfilEmpresa);
    } catch {
      throw new Error("Agente Extrator retornou JSON inválido. Tente novamente.");
    }

    // ==========================================
    // AGENTE 2 — ESTRATEGISTA
    // ==========================================
    console.log("[Agente 2] Estrategista iniciado...");
    const t2 = Date.now();

    const knowledgeBase = `
=== LEGISLAÇÃO TRIBUTÁRIA BRASILEIRA 2026 ===
${LEGISLACAO_TRIBUTARIA}

=== ESTRATÉGIAS TRIBUTÁRIAS PRÁTICAS (GPThales) ===
${ESTRATEGIAS_GPTHALES}
    `.trim();

    const strategistResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${STRATEGIST_SYSTEM_PROMPT}\n\n## BASE DE CONHECIMENTO\n\n${knowledgeBase}`,
        },
        {
          role: "user",
          content: `Analise o perfil desta empresa e identifique todas as estratégias tributárias aplicáveis com economia em R$. Retorne em formato json.\n\n${perfilEmpresa}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      timeout_ms: 55000,
    });

    const estrategiasJson = strategistResponse.choices[0].message.content;
    totalTokens += strategistResponse.usage.total_tokens;
    console.log(`[Agente 2] Estrategista concluído em ${Date.now() - t2}ms`);

    // ==========================================
    // AGENTE 3 — FORMATADOR
    // ==========================================
    console.log("[Agente 3] Formatador iniciado...");
    const t3 = Date.now();

    const formatterResponse = await chatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: FORMATTER_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Formate o relatório final em json com os seguintes dados:\n\nPerfil da empresa:\n${perfilEmpresa}\n\nEstratégias identificadas:\n${estrategiasJson}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      timeout_ms: 40000,
    });

    const resultadoFinal = formatterResponse.choices[0].message.content;
    totalTokens += formatterResponse.usage.total_tokens;
    console.log(`[Agente 3] Formatador concluído em ${Date.now() - t3}ms`);

    // Parsear resultado final
    let resultado;
    try {
      resultado = JSON.parse(resultadoFinal);
    } catch {
      // Salvar erro no DB antes de falhar
      if (analiseId) {
        await supabase
          .from("analises")
          .update({ status: "erro", erro_mensagem: "Formatador retornou JSON inválido" })
          .eq("id", analiseId);
      }
      throw new Error("Formatador retornou JSON inválido. Tente novamente.");
    }

    // Validar campo obrigatório
    if (!resultado.economia_total_anual && resultado.economia_total_anual !== 0) {
      console.warn("Resultado sem economia_total_anual, calculando a partir das estratégias...");
      resultado.economia_total_anual = (resultado.estrategias || []).reduce(
        (sum: number, e: { economia_estimada_anual?: number }) => sum + (e.economia_estimada_anual || 0),
        0
      );
      resultado.economia_total_mensal = resultado.economia_total_anual / 12;
    }

    const tempoMs = Date.now() - startTime;

    // 4. Atualizar análise com resultado
    const { error: updateError } = await supabase
      .from("analises")
      .update({
        status: "concluida",
        resultado,
        economia_total_estimada: resultado.economia_total_anual,
        num_estrategias: resultado.estrategias?.length || 0,
        tempo_processamento_ms: tempoMs,
        tokens_usados: totalTokens,
      })
      .eq("id", analiseId);

    if (updateError) {
      console.error("Erro ao atualizar análise:", updateError.message);
    }

    // Se tem documento, atualizar texto extraído
    if (documento_base64) {
      try {
        const perfil = JSON.parse(perfilEmpresa);
        if (perfil.informacoes_adicionais) {
          await supabase
            .from("documentos")
            .update({ texto_extraido: perfil.informacoes_adicionais })
            .eq("analise_id", analiseId);
        }
      } catch (e) {
        console.warn("Falha ao salvar texto_extraido:", e);
      }
    }

    console.log(`[TOTAL] Análise concluída em ${tempoMs}ms | ${totalTokens} tokens`);

    return new Response(
      JSON.stringify({
        analise_id: analiseId,
        empresa_id: empresaId,
        resultado,
        economia_total_estimada: resultado.economia_total_anual,
        num_estrategias: resultado.estrategias?.length || 0,
        tempo_processamento_ms: tempoMs,
        tokens_usados: totalTokens,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na análise:", error);

    // Tentar marcar análise como erro no DB
    if (analiseId) {
      try {
        await supabase
          .from("analises")
          .update({
            status: "erro",
            erro_mensagem: error instanceof Error ? error.message : "Erro desconhecido",
            tempo_processamento_ms: Date.now() - startTime,
          })
          .eq("id", analiseId);
      } catch (dbErr) {
        console.error("Falha ao registrar erro no DB:", dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        error: "Erro ao processar análise",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
