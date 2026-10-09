import { z } from "zod";

export const transportSchema = z.discriminatedUnion("needsTransport", [
  z.object({
    responseId: z.string().uuid(),
    needsTransport: z.literal(true),
    participantName: z.string().trim().min(3, "Digite seu nome completo.").max(100, "Nome muito longo."),
  }),
  z.object({
    responseId: z.string().uuid(),
    needsTransport: z.literal(false),
    participantName: z.null(),
  }),
]);