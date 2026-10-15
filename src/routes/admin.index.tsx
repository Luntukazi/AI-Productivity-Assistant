import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, startOfWeek, endOfWeek } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Bot, ListChecks, Mail, NotebookPen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, StatusBadge, Empty } from "@/components/admin-ui";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const { data: appts = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => (await supabase.from("appointments").select("*").order("starts_at")).data ?? [],
  });
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: async () => (await supabase.from("tasks").select("*").order("created_at")).data ?? [] });
  const { data: enq = [] } = useQuery({ queryKey: ["enquiries"], queryFn: async () => (await supabase.from("enquiries").select("*").order("created_at", { ascending: false })).data ?? [] });

  const now = new Date();
  const today = appts.filter((a) => isToday(new Date(a.starts_at)) && a.status !== "cancelled");
  const upcoming = appts.filter((a) => new Date(a.starts_at) > now && ["pending", "confirmed"].includes(a.status));
  const ws = startOfWeek(now, { weekStartsOn: 1 }), we = endOfWeek(now, { weekStartsOn: 1 });
  const week = appts.filter((a) => new Date(a.starts_at) >= ws && new Date(a.starts_at) <= we);
  const count = (s: string) => appts.filter((a) => a.status === s).length;
  const popularity = Object.entries(appts.reduce<Record<string, number>>((m, a) => ((m[a.service_name] = (m[a.service_name] ?? 0) + 1), m), {}))
    .map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  const stats = [
    { l: "Today", v: today.length }, { l: "This week", v: week.length }, { l: "Pending", v: count("pending") },
    { l: "Completed", v: count("completed") }, { l: "Cancelled", v: count("cancelled") }, { l: "Open tasks", v: tasks.filter((t) => !t.done).length },
  ];

  return (
    <>
      <PageHeader title="Good day" description={format(now, "EEEE, d MMMM yyyy")} />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.l} className="bg-card border rounded-md p-4"><p className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p><p className="font-display text-4xl mt-1">{s.v}</p></div>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-3 mt-6">
        {[{ to: "/admin/messages", l: "Write a message", i: Mail }, { to: "/admin/notes", l: "Summarise notes", i: NotebookPen }, { to: "/admin/tasks", l: "Plan my day", i: ListChecks }, { to: "/admin/assistant", l: "Ask the assistant", i: Bot }].map((q) => (
          <Link key={q.to} to={q.to} className="bg-ink text-ink-foreground rounded-md p-4 flex items-center gap-3 hover:ring-1 hover:ring-gold"><q.i className="text-gold" /><span className="text-sm">{q.l}</span></Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <section className="bg-card border rounded-md p-6">
          <h2 className="text-2xl mb-4">Today's appointments</h2>
          {today.length === 0 ? <Empty>No appointments today.</Empty> : (
            <ul className="divide-y">{today.map((a) => <li key={a.id} className="py-3 flex justify-between gap-3 text-sm"><span><b>{format(new Date(a.starts_at), "HH:mm")}</b> · {a.customer_name} — {a.service_name}</span><StatusBadge status={a.status} /></li>)}</ul>
          )}
        </section>
        <section className="bg-card border rounded-md p-6">
          <h2 className="text-2xl mb-4">Upcoming bookings</h2>
          {upcoming.length === 0 ? <Empty>No upcoming bookings.</Empty> : (
            <ul className="divide-y">{upcoming.slice(0, 6).map((a) => <li key={a.id} className="py-3 flex justify-between gap-3 text-sm"><span>{format(new Date(a.starts_at), "EEE d MMM, HH:mm")} · {a.customer_name}</span><StatusBadge status={a.status} /></li>)}</ul>
          )}
          <Link to="/admin/appointments" className="text-sm underline mt-3 inline-block">Manage all</Link>
        </section>
        <section className="bg-card border rounded-md p-6">
          <h2 className="text-2xl mb-4">Service popularity</h2>
          {popularity.length < 1 ? <Empty>Not enough booking data yet.</Empty> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={popularity} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} /><Tooltip />
                <Bar dataKey="value" fill="var(--gold)" radius={3} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
        <section className="bg-card border rounded-md p-6">
          <h2 className="text-2xl mb-4">New enquiries</h2>
          {enq.filter((e) => e.status === "new").length === 0 ? <Empty>No new enquiries.</Empty> : (
            <ul className="divide-y">{enq.filter((e) => e.status === "new").slice(0, 5).map((e) => <li key={e.id} className="py-3 text-sm"><b>{e.name}</b> — <span className="text-muted-foreground">{e.message.slice(0, 70)}</span></li>)}</ul>
          )}
        </section>
      </div>
    </>
  );
}
