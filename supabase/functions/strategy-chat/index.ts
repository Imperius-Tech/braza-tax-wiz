import { corsHeaders } from "../_shared/cors.ts";
import { chatCompletion } from "../_shared/openai.ts";

const SYSTEM_PROMPT = `Voce e um consultor tributario brasileiro especialista. O usuario vai sugerir estrategias tributarias para uma empresa especifica. Sua funcao e analisar se a estrategia sugerida e VALIDA e APLICAVEL para aquela empresa.

## REGRAS

1. Analise a estrategia considerando: regime tributario atual, setor, faturamento, numero de funcionarios, estado
2. Se a estrategia for VALIDA:
   - Explique como implementar em 2-3 passos praticos
   - Estime a economia potencial em R$ se possivel
   - Cite a fundamentacao legal
3. Se a estrategia NAO for valida:
   - Explique claramente POR QUE nao faz sentido para essa empresa
   - Sugira uma alternativa que faca sentido
4. Seja direto e pratico, sem enrolacao
5. Use linguagem acessivel (sem jargao excessivo)
6. Responda SOMENTE em JSON valido

## FORMATO DE SAIDA

{
  "valido": boolean,
  "resposta": "string — sua analise completa em texto corrido (2-4 paragrafos)"
}`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { mensagem, empresa_context, resultado_context, historico } = await req.json();

    if (!mensagem) {
      return new Response(
        JSON.stringify({ error: "Mensagem obrigatoria" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `CONTEXTO DA EMPRESA:\n${empresa_context}\n\nESTRATEGIAS JA IDENTIFICADAS:\n${resultado_context}`,
      },
      { role: "assistant", content: '{"entendido": true}' },
    ];

    // Add conversation history
    if (historico && Array.isArray(historico)) {
      for (const msg of historico) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: mensagem });

    const response = await chatCompletion({
      model: "gpt-4o-mini",
      messages: messages as any,
      temperature: 0.4,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      timeout_ms: 30000,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[strategy-chat] ERRO:", error);
    return new Response(
      JSON.stringify({
        error: "Erro no chat",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
