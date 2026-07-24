import { loadContent } from "@/lib/content/loader";
import { logRequest } from "@/lib/logging/request-logger";
import { createLLMClient } from "@/lib/llm/client";
import type { ChatMessage } from "@/lib/llm/types";
import { getRateLimiter } from "@/lib/rate-limit";
import {
  buildSystemPrompt,
  detectPromptInjection,
  REFUSAL_RESPONSE,
} from "@/lib/prompts/system-prompt";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

interface ChatRequestBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function createRefusalStream(message: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: message })}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIp(request);

  const rateLimiter = getRateLimiter();
  const rateLimit = await rateLimiter.check(clientIp);

  if (!rateLimit.success) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
        resetAt: rateLimit.resetAt?.toISOString(),
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userMessages = body.messages?.filter((m) => m.role === "user") ?? [];
  const lastUserMessage = userMessages[userMessages.length - 1]?.content ?? "";

  if (!lastUserMessage.trim()) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (detectPromptInjection(lastUserMessage)) {
    logRequest({
      timestamp: new Date().toISOString(),
      question: lastUserMessage,
      response: REFUSAL_RESPONSE,
      latencyMs: Date.now() - startTime,
      clientIp,
      refused: true,
    });

    return new Response(createRefusalStream(REFUSAL_RESPONSE), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  try {
    const content = await loadContent();
    const systemPrompt = buildSystemPrompt(content);
    const llm = createLLMClient();

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...body.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of llm.stream(messages)) {
            fullResponse += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ content: chunk })}\n\n`,
              ),
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          logRequest({
            timestamp: new Date().toISOString(),
            question: lastUserMessage,
            response: fullResponse,
            latencyMs: Date.now() - startTime,
            clientIp,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Stream error";
          logRequest({
            timestamp: new Date().toISOString(),
            question: lastUserMessage,
            response: fullResponse,
            latencyMs: Date.now() - startTime,
            clientIp,
            error: message,
          });
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    logRequest({
      timestamp: new Date().toISOString(),
      question: lastUserMessage,
      response: "",
      latencyMs: Date.now() - startTime,
      clientIp,
      error: message,
    });

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
