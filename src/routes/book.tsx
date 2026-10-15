import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery } from "@/lib/queries";
import { SALON, formatRand, formatDuration } from "@/lib/salon-info";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  validateSearch: z.object({ service: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Book an Appointment — LM Hair Salon" },
      { name: "description", content: "Choose a service, date and time and request your appointment at LM Hair Salon online." },
      { property: "og:title", content: "Book an Appointment — LM Hair Salon" },
      { property: "og:description", content: "Request your LM Hair Salon appointment in under a minute." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Book,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(255),
  requests: z.string().max(1000).optional(),
});

// SAST is UTC+2 year-round
const toSast = (day: string, hhmm: string) => new Date(`${day}T${hhmm}:00+02:00`);

function Book() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  const search = Route.useSearch();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(search.service ?? "");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [booked, setBooked] = useState<{ starts_at: string; ends_at: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", requests: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const service = services.find((s) => s.id === serviceId);

  const days = useMemo(
    () => Array.from({ length: 21 }, (_, i) => addDays(new Date(), i)).filter((d) => !SALON.closedDays.includes(d.getDay())),
    [],
  );

  useEffect(() => {
    if (!day) return;
    setLoadingSlots(true);
    supabase.rpc("get_booked_slots", { _day: day }).then(({ data, error }) => {
      if (error) toast.error("Couldn't load availability. Please try again.");
      setBooked(data ?? []);
      setLoadingSlots(false);
    });
  }, [day]);

  const slots = useMemo(() => {
    if (!day || !service) return [];
    const isSat = new Date(`${day}T12:00:00+02:00`).getUTCDay() === 6;
    const close = (isSat ? 16 : 18) * 60;
    const out: { t: string; available: boolean }[] = [];
    for (let m = SALON.openHour * 60; m + service.duration_minutes <= close; m += 30) {
      const t = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      const start = toSast(day, t);
      const end = new Date(start.getTime() + service.duration_minutes * 60000);
      const clash = booked.some((b) => new Date(b.starts_at) < end && new Date(b.ends_at) > start);
      out.push({ t, available: !clash && start > new Date() });
    }
    return out;
  }, [day, service, booked]);

  const goReview = () => {
    const r = contactSchema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setStep(4);
  };

  const submit = async () => {
    if (!service) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("book_appointment", {
      _service_id: service.id,
      _starts_at: toSast(day, time).toISOString(),
      _name: form.name,
      _phone: form.phone,
      _email: form.email,
      _requests: form.requests,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      if (error.message.includes("booked")) { setTime(""); setStep(2); setDay((d) => d); }
      return;
    }
    setReference(data as string);
  };

  if (reference) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-xl px-5 py-24 text-center">
          <div className="bg-ink text-ink-foreground rounded-md p-10 shadow-elegant">
            <Logo size="lg" showTagline />
            <CheckCircle2 className="mx-auto mt-8 size-10 text-gold" />
            <h1 className="text-4xl mt-4">Request received</h1>
            <p className="mt-3 text-ink-foreground/70">Your booking reference is</p>
            <p className="font-display text-4xl text-gold-gradient mt-1">{reference}</p>
            <div className="mt-6 text-sm text-ink-foreground/80 space-y-1">
              <p>{service?.name}</p>
              <p>{format(toSast(day, time), "EEEE d MMMM yyyy")} at {time}</p>
            </div>
            <p className="mt-6 text-xs text-ink-foreground/50">Your appointment is pending until the salon confirms it with you.</p>
          </div>
          <Button asChild variant="outline" className="mt-8"><Link to="/">Back to home</Link></Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-ink text-ink-foreground py-16 text-center">
        <p className="eyebrow">Online Booking</p>
        <h1 className="text-5xl mt-3">Book an Appointment</h1>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-14">
        <ol className="flex justify-between mb-10 text-xs uppercase tracking-widest">
          {["Service", "Date & time", "Your details", "Review"].map((l, i) => (
            <li key={l} className={cn("flex-1 text-center pb-2 border-b-2", step > i ? "border-gold text-foreground" : "border-border text-muted-foreground")}>{l}</li>
          ))}
        </ol>

        {step === 1 && (
          <div className="grid gap-3">
            {services.map((s) => (
              <button key={s.id} onClick={() => { setServiceId(s.id); setTime(""); }} className={cn("text-left border rounded-md p-5 flex justify-between items-center transition-colors", serviceId === s.id ? "border-gold bg-gold/10" : "hover:border-gold/50")}>
                <div><p className="font-display text-xl">{s.name}</p><p className="text-sm text-muted-foreground">{formatDuration(s.duration_minutes)}</p></div>
                <p className="font-medium">{formatRand(Number(s.price))}{s.is_sample_price && <span className="block text-[0.6rem] uppercase tracking-widest text-warning">Sample</span>}</p>
              </button>
            ))}
            <Button variant="gold" className="mt-4" disabled={!service} onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <Label>Choose a date</Label>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const v = format(d, "yyyy-MM-dd");
                return (
                  <button key={v} onClick={() => { setDay(v); setTime(""); }} className={cn("shrink-0 w-16 py-3 rounded-md border text-center", day === v ? "border-gold bg-ink text-ink-foreground" : "hover:border-gold/50")}>
                    <span className="block text-[0.65rem] uppercase">{format(d, "EEE")}</span>
                    <span className="block font-display text-2xl">{format(d, "d")}</span>
                    <span className="block text-[0.65rem]">{format(d, "MMM")}</span>
                  </button>
                );
              })}
            </div>
            {day && (
              <div className="mt-8">
                <Label>Available times</Label>
                {loadingSlots ? <Loader2 className="mt-4 animate-spin" /> : (
                  <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {slots.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No times available on this day.</p>}
                    {slots.map((s) => (
                      <button key={s.t} disabled={!s.available} onClick={() => setTime(s.t)} className={cn("py-2 rounded-md border text-sm", time === s.t ? "bg-gold text-ink border-gold" : s.available ? "hover:border-gold" : "opacity-30 line-through cursor-not-allowed")}>{s.t}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-8 flex gap-3"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button variant="gold" className="flex-1" disabled={!time} onClick={() => setStep(3)}>Continue</Button></div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            {([["name", "Full name"], ["phone", "Phone number"], ["email", "Email address"]] as const).map(([k, l]) => (
              <div key={k}>
                <Label htmlFor={k}>{l}</Label>
                <Input id={k} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1.5" />
                {errors[k] && <p className="text-sm text-destructive mt-1">{errors[k]}</p>}
              </div>
            ))}
            <div>
              <Label htmlFor="req">Special requests (optional)</Label>
              <Textarea id="req" maxLength={1000} value={form.requests} onChange={(e) => setForm({ ...form, requests: e.target.value })} className="mt-1.5" />
            </div>
            <p className="text-xs text-muted-foreground">Your details are used only to manage this appointment. See our <Link to="/privacy" className="underline">privacy notice</Link>.</p>
            <div className="flex gap-3"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button variant="gold" className="flex-1" onClick={goReview}>Review booking</Button></div>
          </div>
        )}

        {step === 4 && service && (
          <div className="border border-gold/30 rounded-md p-8 bg-card">
            <h2 className="text-3xl">Review your booking</h2>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Service</dt><dd>{service.name}</dd>
              <dt className="text-muted-foreground">Price</dt><dd>{formatRand(Number(service.price))}{service.is_sample_price && " (sample, to be confirmed)"}</dd>
              <dt className="text-muted-foreground">When</dt><dd>{format(toSast(day, time), "EEEE d MMMM yyyy")} at {time} ({formatDuration(service.duration_minutes)})</dd>
              <dt className="text-muted-foreground">Name</dt><dd>{form.name}</dd>
              <dt className="text-muted-foreground">Phone</dt><dd>{form.phone}</dd>
              <dt className="text-muted-foreground">Email</dt><dd>{form.email}</dd>
              {form.requests && <><dt className="text-muted-foreground">Requests</dt><dd>{form.requests}</dd></>}
            </dl>
            <div className="mt-8 flex gap-3"><Button variant="outline" onClick={() => setStep(3)}>Edit</Button><Button variant="gold" className="flex-1" disabled={submitting} onClick={submit}>{submitting && <Loader2 className="animate-spin" />}Confirm request</Button></div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
