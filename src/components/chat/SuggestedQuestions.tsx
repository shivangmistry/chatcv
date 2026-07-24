"use client";

import { SUGGESTED_QUESTIONS } from "./types";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
      {SUGGESTED_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          disabled={disabled}
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
