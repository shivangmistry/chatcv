"use client";

import { siteConfig } from "@/lib/site-config";

export function ResumeDownloadButton() {
  const handleDownload = async () => {
    try {
      const response = await fetch("/api/resume/pdf");
      if (!response.ok) {
        throw new Error(`Resume download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = siteConfig.resumePdfFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Resume
    </button>
  );
}
