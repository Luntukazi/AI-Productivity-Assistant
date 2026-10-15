import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SALON } from "@/lib/salon-info";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LM Hair Salon" },
      { name: "description", content: "Get in touch with LM Hair Salon: location, phone, email, opening hours and enquiry form." },
      { property: "og:title", content: "Contact LM Hair Salon" },
      { property: "og:description", content: "Send us an enquiry or visit the salon." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("enquiries").insert({ ...r.data, phone: r.data.phone || null });
    setBusy(false);
    if (error) return toast.error("Couldn't send your message. Please try again.");
    toast.success("Thank you! We'll be in touch soon.");
    setF({ name: "", email: "", phone: "", message: "" });
  };
  return (
    <SiteLayout>
      <section className="bg-ink text-ink-foreground py-16 text-center"><p className="eyebrow">Get in touch</p><h1 className="text-5xl mt-3">Contact Us</h1></section>
      <section className="mx-auto max-w-6xl px-5 py-16 grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          {[{ i: MapPin, t: SALON.address }, { i: Phone, t: SALON.phone }, { i: Mail, t: SALON.email }].map(({ i: I, t }) => (
            <p key={t} className="flex gap-3"><I className="text-gold shrink-0" />{t}</p>
          ))}
          <div className="flex gap-3"><Clock className="text-gold shrink-0" /><div>{SALON.hours.map((h) => <p key={h.day}>{h.day}: {h.time}</p>)}</div></div>
          <div className="flex gap-4">{SALON.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-sm underline hover:text-gold">{s.label}</a>)}</div>
          <p className="text-xs text-muted-foreground">Contact details are placeholders until the salon confirms them.</p>
        </div>
        <form onSubmit={submit} className="grid gap-4 bg-card border border-gold/20 rounded-md p-8 shadow-elegant">
          {(["name", "email", "phone"] as const).map((k) => (
            <div key={k}>
              <Label htmlFor={k} className="capitalize">{k}{k === "phone" && " (optional)"}</Label>
              <Input id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1.5" />
              {errors[k] && <p className="text-sm text-destructive mt-1">{errors[k]}</p>}
            </div>
          ))}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} maxLength={2000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className="mt-1.5" />
            {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
          </div>
          <Button type="submit" variant="gold" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Send message</Button>
        </form>
      </section>
    </SiteLayout>
  );
}
