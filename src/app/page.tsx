import { ChatInterface } from "@/components/chat/ChatInterface";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <main className="flex h-dvh flex-col">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden border-x border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <ChatInterface />
      </div>

      <SiteFooter />
    </main>
  );
}
