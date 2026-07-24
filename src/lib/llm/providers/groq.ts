import type {
  ChatMessage,
  LLMClient,
  LLMClientConfig,
  LLMCompletionResult,
} from "../types";

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";

export function createGroqClient(config: LLMClientConfig): LLMClient {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;

  async function* stream(messages: ChatMessage[]): AsyncIterable<string> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errorBody}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Groq API returned no response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // Skip malformed SSE chunks
        }
      }
    }
  }

  async function complete(messages: ChatMessage[]): Promise<LLMCompletionResult> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content ?? "",
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };
  }

  return { stream, complete };
}
