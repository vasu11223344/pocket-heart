import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X } from "lucide-react";
import { chatStream } from "@/lib/chat.functions";

interface Msg { role: "user" | "assistant"; content: string }

export function Chatbot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm the Green Spark Solar assistant. Ask me about pricing, the PM Surya Ghar subsidy, or installations." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const callChat = useServerFn(chatStream);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (location.pathname.startsWith("/admin")) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMessages(next);
    setBusy(true);
    try {
      const stream = await callChat({ data: { messages: next.slice(0, -1).filter(m => m.content) } });
      let acc = "";
      for await (const chunk of stream as AsyncIterable<{ delta: string }>) {
        acc += chunk.delta;
        setMessages((cur) => {
          const copy = cur.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setMessages((cur) => {
        const copy = cur.slice();
        copy[copy.length - 1] = { role: "assistant", content: "Sorry, something went wrong. Please WhatsApp us instead." };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-3 pr-5 py-3 shadow-2xl shadow-black/30 hover:scale-105 transition"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15">
            <Bot className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold">Ask AI</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 left-6 right-6 sm:right-auto z-50 w-auto sm:w-[380px] max-h-[70vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-5 py-4 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <div className="text-sm font-semibold">Green Spark Assistant</div>
                <div className="text-[10px] opacity-80">AI-powered · Replies in seconds</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-primary-foreground/15"><X className="h-4 w-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                  {m.content || <span className="opacity-50">…</span>}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 p-3 border-t border-border bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pricing, subsidy…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm"
              disabled={busy}
            />
            <button type="submit" disabled={busy || !input.trim()} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
