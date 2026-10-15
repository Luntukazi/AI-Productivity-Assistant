import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import braids from "@/assets/braids.jpg";
import treatment from "@/assets/treatment.jpg";
import interior from "@/assets/interior.jpg";
import { SiteLayout } from "@/components/site-layout";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/queries";
import { SALON, formatRand, formatDuration } from "@/lib/salon-info";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LM Hair Salon — Your Beauty, Our Passion" },
      { name: "description", content: "Luxury braiding, cuts, colour, treatments and wig styling. Book your appointment online at LM Hair Salon." },
      { property: "og:title", content: "LM Hair Salon — Your Beauty, Our Passion" },
      { property: "og:description", content: "Style. Beauty. Confidence. Book braids, colour, treatments and more online." },
    ],
  }),
  component: Home,
});

const testimonials = [
  { name: "Sample review", text: "My knotless braids were neat, light and lasted for weeks. The salon feels so luxurious." },
  { name: "Sample review", text: "Professional, welcoming and on time. My colour came out exactly as I hoped." },
  { name: "Sample review", text: "The treatment left my hair soft and healthy. I always leave feeling confident." },
];

function Home() {
  const { data: services } = useQuery(servicesQuery);
  return (
    <SiteLayout>
      <section className="relative bg-ink text-ink-foreground overflow-hidden">
        <img src={hero} alt="Woman with elegant styled hair" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-right opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 md:py-40">
          <div className="max-w-xl fade-up">
            <p className="eyebrow">Style. Beauty. Confidence.</p>
            <h1 className="mt-5 text-5xl md:text-7xl leading-[0.95]">Your Beauty, <em className="text-gold-gradient">Our Passion.</em></h1>
            <p className="mt-6 text-ink-foreground/75 text-lg font-light max-w-md">A refined salon experience for braids, cuts, colour and nourishing treatments — crafted around you.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="gold" size="lg"><Link to="/book">Book an Appointment</Link></Button>
              <Button asChild variant="outline-gold" size="lg"><Link to="/services">Explore Our Services</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 grid md:grid-cols-2 gap-14 items-center">
        <img src={interior} alt="LM Hair Salon interior" width={1408} height={912} loading="lazy" className="rounded-md shadow-elegant" />
        <div>
          <p className="eyebrow">Welcome</p>
          <h2 className="text-4xl md:text-5xl mt-3">Where every visit is a moment of luxury</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">At LM Hair Salon we combine skilled hands, quality products and genuine care. Whether you want protective braids, a fresh cut, bold colour or a restorative treatment, our stylists listen first and create a look that feels like you.</p>
        </div>
      </section>

      <section className="bg-beige py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <p className="eyebrow">Popular Services</p>
            <h2 className="text-4xl md:text-5xl mt-3">Signature treatments</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {(services ?? []).slice(0, 3).map((s) => (
              <div key={s.id} className="bg-card p-8 rounded-md border border-gold/20 shadow-elegant">
                <p className="eyebrow">{s.category}</p>
                <h3 className="text-2xl mt-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground mt-3">{s.description}</p>
                <p className="mt-5 text-sm">From <span className="font-semibold">{formatRand(Number(s.price))}</span> · {formatDuration(s.duration_minutes)}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><Button asChild variant="outline"><Link to="/services">View all services</Link></Button></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="text-center"><p className="eyebrow">Featured Looks</p><h2 className="text-4xl md:text-5xl mt-3">Crafted with care</h2></div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[{ img: braids, t: "Knotless Braids" }, { img: treatment, t: "Restorative Treatments" }].map((f) => (
            <figure key={f.t} className="relative overflow-hidden rounded-md group">
              <img src={f.img} alt={f.t} width={912} height={1104} loading="lazy" className="h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <figcaption className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-ink to-transparent text-ink-foreground font-display text-2xl">{f.t}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ink-foreground py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center"><p className="eyebrow">Kind Words</p><h2 className="text-4xl md:text-5xl mt-3">Loved by our clients</h2></div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="border border-gold/25 rounded-md p-8">
                <div className="flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="size-4 fill-current" />)}</div>
                <p className="mt-4 font-display text-xl italic">“{t.text}”</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-ink-foreground/50">{t.name}</p>
              </blockquote>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink-foreground/40">Sample testimonials — replace with real client reviews.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 grid md:grid-cols-3 gap-10 text-center">
        <div><p className="eyebrow">Call</p><p className="mt-3 text-lg">{SALON.phone}</p><p className="text-sm text-muted-foreground">{SALON.email}</p></div>
        <div className="flex justify-center"><Logo size="lg" className="text-foreground" /></div>
        <div><p className="eyebrow">Hours</p>{SALON.hours.map((h) => <p key={h.day} className="text-sm mt-1">{h.day}: {h.time}</p>)}</div>
      </section>
    </SiteLayout>
  );
}
