import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white/80 py-3 text-center text-xs text-zinc-500 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
      <p>
        © {new Date().getFullYear()} {siteConfig.name} · Chat with my AI resume
      </p>
    </footer>
  );
}
