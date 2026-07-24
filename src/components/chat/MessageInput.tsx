"use client";

import { siteConfig } from "@/lib/site-config";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: MessageInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSubmit();
    }
  }

  return (
    <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${siteConfig.firstName}'s experience, skills, or projects...`}
          disabled={disabled}
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
