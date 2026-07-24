import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <main className="flex h-dvh flex-col">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              ChatCV
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Chat with my professional background
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
