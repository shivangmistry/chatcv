"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-background px-2 py-1 text-sm font-medium text-foreground transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
    >
      <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors dark:bg-zinc-700">
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            isDark ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="sr-only">Toggle theme</span>
      <span className="text-xs font-medium">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
