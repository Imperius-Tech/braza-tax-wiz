import { corsHeaders } from "../_shared/cors.ts";
import { chatCompletion } from "../_shared/openai.ts";
import { FINANCEIRO_SYSTEM_PROMPT } from "../_shared/prompts/modules/financeiro.ts";
import { DEPARTAMENTO_PESSOAL_SYSTEM_PROMPT } from "../_shared/prompts/modules/departamento-pessoal.ts";
import { ABERTURA_EMPRESA_SYSTEM_PROMPT } from "../_shared/prompts/modules/abertura-empresa.ts";
import { FISCAL_SYSTEM_PROMPT } from "../_shared/prompts/modules/fiscal.ts";

const MODULE_PROMPTS: Record<string, string> = {
  financeiro: FINANCEIRO_SYSTEM_PROMPT,
  departamento_pessoal: DEPARTAMENTO_PESSOAL_SYSTEM_PROMPT,
  abertura_empresa: ABERTURA_EMPRESA_SYSTEM_PROMPT,
  fiscal: FISCAL_SYSTEM_PROMPT,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  let totalTokens = 0;

  try {
    const { modulo, dados, documento_texto } = await req.json();

    if (!modulo || !MODULE_PROMPTS[modulo]) {
      return new Response(
        JSON.stringify({ error: "Modulo invalido", details: `Modulo "${modulo}" nao encontrado. Disponiveis: ${Object.keys(MODULE_PROMPTS).join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!dados) {
      return new Response(
        JSON.stringify({ error: "Dados obrigatorios", details: "O campo 'dados' e obrigatorio." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = MODULE_PROMPTS[modulo];

    // Build user message with all provided data
    let userMessage = `Dados informados pelo usuario:\n\n${JSON.stringify(dados, null, 2)}`;

    if (documento_texto) {
      userMessage += `\n\n--- TEXTO EXTRAIDO DO DOCUMENTO ---\n${documento_texto}`;
    }

    console.log(`[module-analyze] Modulo: ${modulo} | Dados: ${JSON.stringify(dados).length} chars`);

    // Single AI call — each module has a comprehensive prompt
    const response = await chatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      timeout_ms: 60000,
    });

    totalTokens += response.usage.total_tokens;
    const resultado = JSON.parse(response.choices[0].message.content);

    const tempoMs = Date.now() - startTime;
    console.log(`[module-analyze] Modulo: ${modulo} | Tokens: ${totalTokens} | Tempo: ${tempoMs}ms`);

    return new Response(
      JSON.stringify({
        modulo,
        resultado,
        tempo_processamento_ms: tempoMs,
        tokens_usados: totalTokens,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const tempoMs = Date.now() - startTime;
    console.error(`[module-analyze] ERRO (${tempoMs}ms):`, error);

    return new Response(
      JSON.stringify({
        error: "Erro ao processar modulo",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
