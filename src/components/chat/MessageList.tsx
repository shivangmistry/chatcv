"use client";

import type { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
          Ask me anything about my professional background
        </p>
        <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
          I can tell you about my experience, skills, projects, and career — all
          grounded in my resume and knowledge base.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
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
