"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Search, Send, X } from "lucide-react";
import { AssistantProductCard } from "@/components/assistant/AssistantProductCard";
import { useLocale } from "@/contexts/LocaleContext";
import type { AssistantReply } from "@/lib/assistant/respond";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import "./assistant-speech.css";

type AssistantView = "menu" | "chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: AssistantReply["products"];
};

function AssistantAvatar({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={siteConfig.assets.assistantMascot}
      alt=""
      width={size}
      height={size}
      className={cn("object-contain", className)}
      aria-hidden
    />
  );
}

export function SalesAssistant() {
  const { locale, dict } = useLocale();
  const t = dict.assistant;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AssistantView>("menu");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: t.welcome,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openWorkspace() {
    setOpen(true);
    setView("menu");
  }

  function closeWorkspace() {
    setOpen(false);
    setView("menu");
  }

  function startProductSearch() {
    setView("chat");
  }

  useEffect(() => {
    if (open && view === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, view, messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, locale }),
      });

      const reply = (await res.json()) as AssistantReply;

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: reply.message,
          products: reply.products,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: t.error,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <>
      <div
        className={cn(
          "assistant-anchor fixed bottom-6 end-6 z-[150] md:bottom-8 md:end-8",
          open && "pointer-events-none scale-0 opacity-0 transition-all duration-300"
        )}
      >
        <button
          type="button"
          className="assistant-speech-bubble"
          onClick={openWorkspace}
          aria-label={t.open}
        >
          {t.needHelp}
        </button>

        <button
          type="button"
          onClick={openWorkspace}
          className="shrink-0 transition-transform duration-300 hover:scale-110"
          aria-label={t.open}
          aria-expanded={open}
        >
          <AssistantAvatar
            size={76}
            className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
          />
        </button>
      </div>

      <div
        className={cn(
          "fixed bottom-6 end-6 z-[150] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-3xl border border-gold/20 bg-charcoal/98 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 md:bottom-8 md:end-8",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
        role="dialog"
        aria-label={t.title}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-cream/10 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/20 bg-charcoal-soft">
              <AssistantAvatar size={36} />
            </span>
            <div>
              <p className="text-sm font-medium text-ivory">{t.title}</p>
              <p className="text-[0.6rem] text-cream/45">{t.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeWorkspace}
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label={t.close}
          >
            <X size={18} strokeWidth={1.25} />
          </button>
        </header>

        {view === "menu" ? (
          <div className="space-y-3 px-4 py-6">
            <p className="font-serif text-lg font-light text-ivory">{t.menuPrompt}</p>
            <button
              type="button"
              onClick={startProductSearch}
              className="flex w-full items-center gap-3 rounded-2xl border border-gold/25 bg-charcoal-soft/80 px-4 py-4 text-start transition-all hover:border-gold/45 hover:bg-charcoal-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                <Search size={18} strokeWidth={1.25} />
              </span>
              <span className="text-sm font-light text-cream/90">{t.searchProduct}</span>
            </button>
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-2xl border border-gold/25 bg-charcoal-soft/80 px-4 py-4 transition-all hover:border-gold/45 hover:bg-charcoal-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                <MessageCircle size={18} strokeWidth={1.25} />
              </span>
              <span className="text-sm font-light text-cream/90">{t.contactWhatsApp}</span>
            </a>
          </div>
        ) : (
          <>
            <div className="flex max-h-[min(60vh,420px)] flex-col gap-3 overflow-y-auto px-4 py-4 hide-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex max-w-[90%] flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-end gap-2">
                      <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/15 bg-charcoal-soft">
                        <AssistantAvatar size={24} />
                      </span>
                      <div className="rounded-2xl bg-charcoal-soft px-3.5 py-2.5 text-sm font-light leading-relaxed text-cream/85">
                        {msg.text}
                      </div>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div className="rounded-2xl bg-gold/20 px-3.5 py-2.5 text-sm font-light leading-relaxed text-ivory">
                      {msg.text}
                    </div>
                  )}
                  {msg.role === "assistant" && msg.products && msg.products.length > 0 && (
                    <div className="ms-9 flex w-[calc(100%-2.25rem)] flex-col gap-2">
                      {msg.products.map((product) => (
                        <AssistantProductCard
                          key={product.id}
                          product={product}
                          viewLabel={t.viewProduct}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-1.5 px-2 text-xs text-cream/40">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/60" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/60 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/60 [animation-delay:300ms]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-cream/10 p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {t.quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-full border border-cream/10 px-2.5 py-1 text-[0.6rem] text-cream/55 transition-colors hover:border-gold/30 hover:text-cream"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  className="min-w-0 flex-1 rounded-full border border-cream/10 bg-charcoal-soft px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-gold/40 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal transition-opacity disabled:opacity-40"
                  aria-label={t.send}
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setView("menu")}
                  className="text-[0.6rem] uppercase tracking-[0.12em] text-cream/40 transition-colors hover:text-gold"
                >
                  ← {t.needHelp}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
