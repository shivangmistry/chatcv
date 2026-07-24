export type MessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface LLMCompletionResult {
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface LLMClientConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface LLMClient {
  stream(messages: ChatMessage[]): AsyncIterable<string>;
  complete(messages: ChatMessage[]): Promise<LLMCompletionResult>;
}

export type LLMProvider = "groq" | "openrouter" | "together";
