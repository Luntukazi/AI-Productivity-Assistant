import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/queries";
import { formatRand, formatDuration } from "@/lib/salon-info";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — LM Hair Salon" },
      { name: "description", content: "Braiding, haircuts, colouring, treatments, wash & blow-dry, wigs and occasion styles with prices and durations." },
      { property: "og:title", content: "Services & Pricing — LM Hair Salon" },
      { property: "og:description", content: "Explore LM Hair Salon services and book online." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Services,
});

function Services() {
  const { data } = useSuspenseQuery(servicesQuery);
  const anySample = data.some((s) => s.is_sample_price);
  return (
    <SiteLayout>
      <section className="bg-ink text-ink-foreground py-20 text-center">
        <p className="eyebrow">Our Menu</p>
        <h1 className="text-5xl md:text-6xl mt-3">Services & Pricing</h1>
        {anySample && <p className="mt-4 text-sm text-ink-foreground/60">Prices marked “Sample price” are provisional and will be confirmed by the salon.</p>}
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.length === 0 && <p className="text-muted-foreground">No services are listed yet.</p>}
        {data.map((s) => (
          <article key={s.id} className="flex flex-col bg-card border border-gold/20 rounded-md p-8 shadow-elegant">
            <p className="eyebrow">{s.category}</p>
            <h2 className="text-3xl mt-2">{s.name}</h2>
            <p className="text-sm text-muted-foreground mt-3 flex-1">{s.description}</p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-2xl font-display">{formatRand(Number(s.price))}</p>
                {s.is_sample_price && <span className="text-[0.65rem] uppercase tracking-widest text-warning">Sample price</span>}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="size-4" />{formatDuration(s.duration_minutes)}</p>
            </div>
            <Button asChild variant="gold" className="mt-6"><Link to="/book" search={{ service: s.id }}>Book</Link></Button>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
