import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SALON } from "@/lib/salon-info";
import { ChatWidget } from "@/components/chat-widget";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-ink/95 text-ink-foreground backdrop-blur border-b border-gold/20">
        <div className="mx-auto max-w-7xl px-5 h-20 flex items-center justify-between">
          <Link to="/" aria-label="LM Hair Salon home"><Logo size="sm" /></Link>
          <nav className="hidden md:flex items-center gap-9">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-xs uppercase tracking-[0.25em] text-ink-foreground/70 hover:text-gold transition-colors" activeProps={{ className: "text-gold" }} activeOptions={{ exact: true }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin" className="text-xs uppercase tracking-[0.2em] text-ink-foreground/50 hover:text-gold">Staff</Link>
            <Button asChild variant="gold" size="sm"><Link to="/book">Book Now</Link></Button>
          </div>
          <button className="md:hidden text-gold" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <nav className="md:hidden border-t border-gold/20 px-5 py-4 flex flex-col gap-4">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="uppercase tracking-[0.2em] text-sm">{n.label}</Link>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="uppercase tracking-[0.2em] text-sm text-gold">Staff login</Link>
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-ink text-ink-foreground border-t border-gold/20">
        <div className="mx-auto max-w-7xl px-5 py-14 grid gap-10 md:grid-cols-4">
          <div><Logo showTagline className="items-start" /></div>
          <div>
            <p className="eyebrow mb-3">Visit</p>
            <p className="text-sm text-ink-foreground/70">{SALON.address}</p>
            <p className="text-sm text-ink-foreground/70 mt-2">{SALON.phone}</p>
            <p className="text-sm text-ink-foreground/70">{SALON.email}</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Hours</p>
            {SALON.hours.map((h) => (
              <p key={h.day} className="text-sm text-ink-foreground/70">{h.day}: {h.time}</p>
            ))}
          </div>
          <div>
            <p className="eyebrow mb-3">Follow</p>
            {SALON.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="block text-sm text-ink-foreground/70 hover:text-gold">{s.label}</a>
            ))}
            <Link to="/privacy" className="block text-sm text-ink-foreground/70 hover:text-gold mt-3">Privacy</Link>
          </div>
        </div>
        <p className="text-center text-xs text-ink-foreground/40 pb-8">© {new Date().getFullYear()} LM Hair Salon. Contact details shown are placeholders until confirmed.</p>
      </footer>
      <ChatWidget />
    </div>
  );
}
