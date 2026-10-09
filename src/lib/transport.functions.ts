import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { transportSchema } from "./transport-schema";

export const submitTransportResponse = createServerFn({ method: "POST" })
  .inputValidator((data) => transportSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || "sb_publishable_XtIxDidmRGribIwHX_-ofg_Wg8aKyS3";
    const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"] || "https://gpxqmprrdodvhhoznjbg.supabase.co";
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { error } = await client.from("transport_responses").insert({
      id: data.responseId,
      needs_transport: data.needsTransport,
      participant_name: data.participantName,
    });
    if (error?.code === "23505") return { ok: false as const, reason: "duplicate" as const };
    if (error) throw new Error("Não foi possível registrar a resposta.");
    return { ok: true as const };
  });