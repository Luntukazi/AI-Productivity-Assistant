import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { SALON } from "@/lib/salon-info";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & AI Use — LM Hair Salon" },
      { name: "description", content: "How LM Hair Salon handles your personal information and uses AI responsibly." },
      { property: "og:title", content: "Privacy & AI Use — LM Hair Salon" },
      { property: "og:description", content: "Our commitment to your privacy and responsible AI." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-5 py-20 space-y-6 text-muted-foreground leading-relaxed">
        <h1 className="text-5xl text-foreground">Privacy & AI Use</h1>
        <h2 className="text-2xl text-foreground">Your information</h2>
        <p>We collect your name, phone number and email only to manage appointments and reply to enquiries. Only authorised salon staff can view this information. We do not sell or share it.</p>
        <p>To correct or delete your details, contact us at {SALON.email} or {SALON.phone} and we will update or remove them.</p>
        <h2 className="text-2xl text-foreground">How we use AI</h2>
        <p>Our LM Beauty Assistant chatbot is AI-powered and may make mistakes — please confirm important details with the salon. Staff use AI tools to draft messages, summarise notes and plan tasks; every AI draft is reviewed by a person before use, and nothing is sent or booked automatically.</p>
        <p>Please don't share sensitive personal or health information with the chatbot. Chat conversations are not saved.</p>
      </article>
    </SiteLayout>
  );
}
