import "server-only";
import { z } from "zod";

/**
 * Server-side environment, validated once at startup.
 * Secrets (service role key, AI keys) must only ever be read through here,
 * never via NEXT_PUBLIC_* variables.
 */
const schema = z
  .object({
    DATA_SOURCE: z.enum(["mock", "supabase"]).default("mock"),
    /** Artificial latency for the mock repository so loading states are visible in dev. */
    MOCK_LATENCY_MS: z.coerce.number().int().min(0).max(5000).default(250),
    NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.DATA_SOURCE !== "supabase") return;
    for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const) {
      if (!value[key]) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `${key} is required when DATA_SOURCE=supabase`,
        });
      }
    }
  });

export const env = schema.parse(process.env);
