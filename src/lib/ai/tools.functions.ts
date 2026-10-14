import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: { rpc: (fn: "is_staff", args: { _user_id: string }) => PromiseLike<{ data: boolean | null }> }; userId: string };

async function assertStaff(ctx: Ctx) {
  const { data } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (!data) throw new Error("Only salon staff can use the AI tools.");
}

export const generateMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        purpose: z.string().min(1).max(100),
        audience: z.string().max(200),
        situation: z.string().min(3).max(2000),
        tone: z.enum(["Formal", "Friendly", "Persuasive"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context as unknown as Ctx);
    const { streamText } = await import("ai");
    const { createGateway, reasoningOptions, friendlyAiError } = await import("./gateway.server");
    const { MESSAGE_PROMPT } = await import("./prompts");
    try {
      const { model } = createGateway();
      const result = streamText({
        model,
        instructions: MESSAGE_PROMPT,
        prompt: `Purpose: ${data.purpose}\nAudience: ${data.audience || "Not specified"}\nTone: ${data.tone}\nSituation/details from staff:\n${data.situation}`,
        providerOptions: reasoningOptions,
      });
      const text = (await result.text).trim();
      if (!text) return { ok: false as const, error: "The AI returned no message. Please add more detail and try again." };
      return { ok: true as const, text };
    } catch (e) {
      return { ok: false as const, error: friendlyAiError(e) };
    }
  });

const summarySchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  decisions: z.array(z.string()),
  tasks: z.array(z.object({ task: z.string(), owner: z.string(), deadline: z.string() })),
  followUps: z.array(z.string()),
});
export type NotesSummary = z.infer<typeof summarySchema>;

export const summarizeNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ notes: z.string().min(20).max(20000) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context as unknown as Ctx);
    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { createGateway, reasoningOptions, friendlyAiError } = await import("./gateway.server");
    const { SUMMARY_PROMPT } = await import("./prompts");
    try {
      const { model } = createGateway();
      const result = streamText({
        model,
        instructions: SUMMARY_PROMPT,
        prompt: `Notes:\n"""\n${data.notes}\n"""`,
        output: Output.object({ schema: summarySchema }),
        providerOptions: reasoningOptions,
      });
      try {
        return { ok: true as const, summary: (await result.output) as NotesSummary };
      } catch (e) {
        if (NoObjectGeneratedError.isInstance(e) && e.text) {
          const parsed = summarySchema.safeParse(JSON.parse(e.text));
          if (parsed.success) return { ok: true as const, summary: parsed.data };
        }
        throw e;
      }
    } catch (e) {
      return { ok: false as const, error: friendlyAiError(e) };
    }
  });

const planSchema = z.object({
  plan: z.array(
    z.object({ taskId: z.string(), priority: z.enum(["High", "Medium", "Low"]), timeSlot: z.string(), reason: z.string(), overdue: z.boolean() }),
  ),
  tips: z.array(z.string()),
});
export type TaskPlan = z.infer<typeof planSchema>;

export const planTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        today: z.string().max(20),
        tasks: z.array(z.object({ id: z.string(), title: z.string().max(300), priority: z.string(), due_date: z.string().nullable(), notes: z.string().nullable() })).min(1).max(60),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context as unknown as Ctx);
    const { streamText, Output } = await import("ai");
    const { createGateway, reasoningOptions, friendlyAiError } = await import("./gateway.server");
    const { PLANNER_PROMPT } = await import("./prompts");
    try {
      const { model } = createGateway();
      const result = streamText({
        model,
        instructions: PLANNER_PROMPT,
        prompt: `Today: ${data.today}\nOpening hours: Mon–Fri 08:00–18:00, Sat 08:00–16:00.\nTasks:\n${JSON.stringify(data.tasks)}`,
        output: Output.object({ schema: planSchema }),
        providerOptions: reasoningOptions,
      });
      const plan = (await result.output) as TaskPlan;
      const ids = new Set(data.tasks.map((t) => t.id));
      plan.plan = plan.plan.filter((p) => ids.has(p.taskId));
      return { ok: true as const, plan };
    } catch (e) {
      return { ok: false as const, error: friendlyAiError(e) };
    }
  });
