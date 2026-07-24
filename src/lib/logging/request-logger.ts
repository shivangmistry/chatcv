export interface RequestLogEntry {
  timestamp: string;
  question: string;
  response: string;
  latencyMs: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  clientIp?: string;
  refused?: boolean;
  error?: string;
}

export function logRequest(entry: RequestLogEntry): void {
  const logLine = JSON.stringify({
    level: entry.error ? "error" : "info",
    service: "chatcv",
    event: "chat_request",
    ...entry,
  });

  if (entry.error) {
    console.error(logLine);
  } else {
    console.log(logLine);
  }
}
