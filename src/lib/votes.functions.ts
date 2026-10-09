import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { getPublicVoteResults, isVotingClosed } from "./voting-schedule";
export { VOTING_DEADLINE_ISO } from "./voting-schedule";

export const OPTION_IDS = [
  "churrascaria",
  "restaurante",
  "sitio",
  "espaco",
  "armazem",
] as const;
export type OptionId = (typeof OPTION_IDS)[number];

// Publishable (public) values used as fallback when hosting outside Lovable
// (e.g. Vercel) doesn't define the server env vars.
const FALLBACK_URL = "https://gpxqmprrdodvhhoznjbg.supabase.co";
const FALLBACK_KEY = "sb_publishable_XtIxDidmRGribIwHX_-ofg_Wg8aKyS3";

function publicClient() {
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    FALLBACK_KEY;
  const url =
    process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"] || FALLBACK_URL;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

// Public results are never disclosed, including after the voting deadline.
export const getVoteCounts = createServerFn({ method: "GET" }).handler(async () => getPublicVoteResults());

const voteSchema = z.object({
  voterName: z
    .string()
    .trim()
    .min(3, "Digite seu nome completo.")
    .max(100, "Nome muito longo."),
  optionId: z.enum(OPTION_IDS),
});

export const castVote = createServerFn({ method: "POST" })
  .inputValidator((data) => voteSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    if (isVotingClosed()) {
      return { ok: false as const, reason: "closed" as const };
    }
    const { error } = await supabase.from("votes").insert({
      voter_name: data.voterName,
      option_id: data.optionId,
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, reason: "duplicate" as const };
      }
      throw new Error("Não foi possível registrar o voto.");
    }
    return { ok: true as const };
  });
