import { createGroqClient } from "./providers/groq";
import type { LLMClient, LLMProvider } from "./types";

export function createLLMClient(): LLMClient {
  const provider = (process.env.LLM_PROVIDER ?? "groq") as LLMProvider;
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    throw new Error("LLM_API_KEY environment variable is not set");
  }

  const model =
    process.env.LLM_MODEL ??
    (provider === "groq" ? "llama-3.3-70b-versatile" : "");

  if (!model) {
    throw new Error("LLM_MODEL environment variable is not set");
  }

  switch (provider) {
    case "groq":
      return createGroqClient({ apiKey, model });
    case "openrouter":
    case "together":
      // Stub: wire up additional providers by implementing createOpenRouterClient / createTogetherClient
      throw new Error(
        `Provider "${provider}" is not yet implemented. Add a provider in src/lib/llm/providers/.`,
      );
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}
