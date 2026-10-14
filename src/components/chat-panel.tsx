import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, RotateCcw, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatPanel({ staff = false, className }: { staff?: boolean; className?: string }) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { staff },
        headers: async (): Promise<Record<string, string>> => {
          if (!staff) return {};
          const { data } = await supabase.auth.getSession();
          return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
        },
      }),
    [staff],
  );
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({ transport });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { if (!busy) inputRef.current?.focus(); }, [busy]);

  const submit = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  const suggestions = staff
    ? ["Give me 3 Instagram post ideas for braids this week", "How can I reduce no-shows?"]
    : ["What services do you offer?", "How do I book an appointment?", "How should I prepare for braids?"];

  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground space-y-3">
            <p>Hello! I'm the LM Beauty Assistant. Ask me about our services, prices, booking or hair care.</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => submit(s)} className="text-xs border border-gold/40 rounded-full px-3 py-1.5 hover:bg-gold/10 text-left">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[88%] text-sm", m.role === "user" ? "bg-ink text-ink-foreground rounded-2xl rounded-br-sm px-4 py-2.5" : "prose prose-sm text-foreground")}>
              {m.parts.map((p, i) =>
                p.type === "text" ? (m.role === "user" ? <span key={i} className="whitespace-pre-wrap">{p.text}</span> : <ReactMarkdown key={i}>{p.text}</ReactMarkdown>) : null,
              )}
            </div>
          </div>
        ))}
        {status === "submitted" && <div className="text-sm text-muted-foreground animate-pulse">LM Beauty Assistant is typing…</div>}
        {error && <div className="text-sm text-destructive bg-destructive/10 rounded p-3">{error.message || "Something went wrong. Please try again."}</div>}
        <div ref={endRef} />
      </div>
      <div className="border-t p-3">
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            rows={1}
            maxLength={2000}
            placeholder="Ask a question…"
            className="flex-1 resize-none rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring max-h-32"
          />
          {busy ? (
            <Button type="button" size="icon" variant="outline" onClick={() => stop()} aria-label="Stop"><Square /></Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send"><ArrowUp /></Button>
          )}
        </form>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[0.68rem] text-muted-foreground">AI-generated answers may be inaccurate — please verify important details with the salon.</p>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="text-[0.68rem] text-muted-foreground hover:text-foreground flex items-center gap-1"><RotateCcw className="size-3" />Start over</button>
          )}
        </div>
      </div>
    </div>
  );
}
