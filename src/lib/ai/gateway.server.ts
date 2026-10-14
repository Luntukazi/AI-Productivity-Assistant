import { createOpenAI } from "@ai-sdk/openai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.server";

export const AI_MODEL = "openai/gpt-6-astra";

export class AiConfigError extends Error {}

export function createGateway(request?: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new AiConfigError("AI is not configured yet. Please ask the site owner to enable Lovable AI.");
  const runIdFetch = createLovableAiGatewayRunIdFetch(request ? getLovableAiGatewayRunId(request) : undefined);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return { model: provider.responses(AI_MODEL), runIdFetch };
}

export const reasoningOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

export function friendlyAiError(e: unknown): string {
  const err = e as { statusCode?: number; message?: string };
  const status = err?.statusCode;
  if (e instanceof AiConfigError) return e.message;
  if (status === 429) return "The AI is busy right now. Please wait a moment and try again.";
  if (status === 402) return "AI credits have run out for this workspace. Please add credits to continue.";
  if (status === 403) return "AI access is currently blocked for this workspace. Please contact the administrator.";
  return err?.message?.slice(0, 200) || "The AI request failed. Please try again.";
}
