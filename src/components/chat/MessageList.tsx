"use client";

import { siteConfig } from "@/lib/site-config";
import { useEffect, useRef } from "react";
import type { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-8 text-center text-foreground transition-colors">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
          aria-hidden
        >
          {siteConfig.initials}
        </div>
        <p className="text-xl font-semibold text-foreground">
          Hi, I&apos;m {siteConfig.firstName}
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {siteConfig.tagline} Ask me about my experience at {siteConfig.company},
          RAG/LLM work, or full-stack projects.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="flex flex-1 flex-col gap-4 overflow-y-auto bg-background px-4 py-6 text-foreground transition-colors"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
              message.role === "user"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
            <span className="inline-flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
