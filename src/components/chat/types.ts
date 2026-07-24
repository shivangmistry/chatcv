export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const SUGGESTED_QUESTIONS = [
  "What's your experience with RAG systems?",
  "Tell me about a notable project you've worked on.",
  "What technologies do you work with?",
  "What's your current role?",
];
