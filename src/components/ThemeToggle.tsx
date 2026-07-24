"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-[108px] rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
        aria-hidden
      />
    );
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Theme</span>
      <select
        value={theme ?? "system"}
        onChange={(e) => setTheme(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-3 pr-8 text-sm text-zinc-700 transition-colors hover:border-zinc-300 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
      >
        {themes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 h-4 w-4 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </label>
  );
}
