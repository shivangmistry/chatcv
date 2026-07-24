export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const SUGGESTED_QUESTIONS = [
  "What's your experience with RAG systems at Stackline?",
  "Tell me about ShopperOS and your role.",
  "What AI/LLM features have you shipped?",
  "What's your full-stack tech stack?",
];
