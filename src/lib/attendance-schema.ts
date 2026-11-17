import { z } from "zod";
export const attendanceSchema = z.object({
  responseId: z.string().uuid(),
  willAttend: z.boolean(),
  participantName: z.string().trim().min(3, "Digite seu nome completo.").max(100, "Nome muito longo."),
});
