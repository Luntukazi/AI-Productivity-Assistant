import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm h-[min(560px,70vh)] bg-card border border-gold/30 rounded-lg shadow-elegant flex flex-col overflow-hidden">
          <div className="bg-ink text-ink-foreground px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg leading-none">LM Beauty Assistant</p>
              <p className="text-[0.65rem] text-gold tracking-widest uppercase mt-1">AI-powered</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="size-5" /></button>
          </div>
          <ChatPanel className="flex-1" />
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat with LM Beauty Assistant"
        className="fixed bottom-5 right-4 z-50 size-14 rounded-full bg-gold-gradient text-ink shadow-elegant flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X /> : <MessageCircle />}
      </button>
    </>
  );
}
