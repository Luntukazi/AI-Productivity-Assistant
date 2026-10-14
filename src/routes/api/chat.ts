import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createGateway, reasoningOptions, friendlyAiError } from "@/lib/ai/gateway.server";
import { withLovableAiGatewayRunIdHeader } from "@/lib/ai/run-id.server";
import { chatbotPrompt } from "@/lib/ai/prompts";
import { SALON, formatRand } from "@/lib/salon-info";

async function handleChat(request: Request) {
  try {
    const body = (await request.json()) as { messages: UIMessage[]; staff?: boolean };
    const messages = (body.messages ?? []).slice(-30);
    if (!messages.length) return Response.json({ error: "No message provided." }, { status: 400 });

    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const db = createClient(url, key, { auth: { persistSession: false } });
    const { data: services } = await db.from("services").select("name,description,price,duration_minutes,is_sample_price").eq("active", true).order("sort_order");
    const servicesText = (services ?? [])
      .map((s) => `- ${s.name}: ${formatRand(Number(s.price))}${s.is_sample_price ? " (sample)" : ""}, about ${s.duration_minutes} min — ${s.description}`)
      .join("\n") || "No services listed.";
    const hoursText = SALON.hours.map((h) => `${h.day} ${h.time}`).join("; ");

    let staffMode = false;
    const auth = request.headers.get("authorization");
    if (body.staff && auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      const authed = createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
      const { data: claims } = await authed.auth.getClaims(token);
      if (claims?.claims?.sub) {
        const { data } = await authed.rpc("is_staff", { _user_id: claims.claims.sub });
        staffMode = !!data;
      }
    }

    const { model, runIdFetch } = createGateway(request);
    const result = streamText({
      model,
      instructions: chatbotPrompt(servicesText, hoursText, staffMode),
      messages: await convertToModelMessages(messages),
      abortSignal: request.signal,
      providerOptions: reasoningOptions,
    });
    return withLovableAiGatewayRunIdHeader(
      result.toUIMessageStreamResponse({ onError: (e) => friendlyAiError(e) }),
      runIdFetch,
    );
  } catch (e) {
    return Response.json({ error: friendlyAiError(e) }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/chat")({
  server: { handlers: { POST: ({ request }) => handleChat(request) } },
});
