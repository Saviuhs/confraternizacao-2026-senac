import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const OPTION_IDS = ["churrascaria", "restaurante", "sitio", "espaco"] as const;
export type OptionId = (typeof OPTION_IDS)[number];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
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

export const getVoteCounts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase.rpc("get_vote_counts");
  if (error) throw new Error("Não foi possível carregar os resultados.");
  const counts = Object.fromEntries(OPTION_IDS.map((id) => [id, 0])) as Record<OptionId, number>;
  for (const row of data ?? []) {
    if (OPTION_IDS.includes(row.option_id as OptionId)) {
      counts[row.option_id as OptionId] = Number(row.total);
    }
  }
  return counts;
});

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
