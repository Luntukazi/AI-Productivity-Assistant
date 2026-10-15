import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, LayoutDashboard, ListChecks, LogOut, Mail, MessageSquare, NotebookPen, Scissors, Sparkles as _s, Inbox, Menu, Bot } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { StaffLogin } from "@/components/staff-login";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

void _s;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — LM Hair Salon" },
      { name: "description", content: "LM Hair Salon staff dashboard and LM Smart Assistant." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Dashboard — LM Hair Salon" },
      { property: "og:description", content: "Salon management and AI productivity tools." },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/services", label: "Services & Prices", icon: Scissors },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/tasks", label: "Task Planner", icon: ListChecks, ai: true },
  { to: "/admin/messages", label: "Message Generator", icon: Mail, ai: true },
  { to: "/admin/notes", label: "Notes Summarizer", icon: NotebookPen, ai: true },
  { to: "/admin/assistant", label: "Beauty Assistant", icon: Bot, ai: true },
] as const;

function AdminLayout() {
  const { session, isStaff, loading } = useAuth();
  const [open, setOpen] = useState(false);
  if (loading) return <div className="min-h-screen bg-ink" />;
  if (!session) return <StaffLogin />;
  if (!isStaff)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-3xl">Awaiting access</h1>
          <p className="mt-3 text-muted-foreground text-sm">Your account isn't a staff account yet. Ask the salon administrator to grant you access.</p>
          <Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className={cn("fixed md:sticky top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 border-b border-sidebar-border"><Link to="/"><Logo /></Link></div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="eyebrow px-3 pt-2 pb-1 text-[0.6rem]">Manage</p>
          {nav.map((n, i) => (
            <div key={n.to}>
              {i === 4 && <p className="eyebrow px-3 pt-5 pb-1 text-[0.6rem]">LM Smart Assistant</p>}
              <Link to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: true }} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}>
                <n.icon className="size-4" />{n.label}
              </Link>
            </div>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="m-3 flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent"><LogOut className="size-4" />Sign out</button>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-ink/50 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 min-w-0">
        <header className="md:hidden h-14 bg-ink text-ink-foreground flex items-center px-4 gap-3">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <span className="font-display text-lg">LM Staff</span>
          <MessageSquare className="hidden" />
        </header>
        <main className="p-5 md:p-10 max-w-6xl"><Outlet /></main>
      </div>
    </div>
  );
}
