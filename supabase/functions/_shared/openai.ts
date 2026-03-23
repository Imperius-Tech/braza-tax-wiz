const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | ContentBlock[];
}

interface ChatCompletionOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
  timeout_ms?: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
  };
}

export async function chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada. Use: supabase secrets set OPENAI_API_KEY=sk-...");
  }

  const timeoutMs = options.timeout_ms ?? 45000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.max_tokens ?? 4096,
        response_format: options.response_format ?? { type: "json_object" },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${error}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`OpenAI API timeout após ${timeoutMs / 1000}s. Tente novamente.`);
    }
    throw error;
  }
}
