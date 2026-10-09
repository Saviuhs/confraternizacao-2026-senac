import { useEffect, useRef, useState } from "react";
import { BusFront, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { transportSchema } from "@/lib/transport-schema";
import { submitTransportResponse } from "@/lib/transport.functions";

const RECEIPT_KEY = "senac-transport-response";

export function TransportPoll() {
  const [choice, setChoice] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseId = useRef<string | null>(null);

  useEffect(() => {
    try { setDone(localStorage.getItem(RECEIPT_KEY) === "sent"); } catch { /* Storage is optional. */ }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!choice) { setError("Selecione Sim ou Não."); return; }
    responseId.current ??= crypto.randomUUID();
    const parsed = transportSchema.safeParse({
      responseId: responseId.current,
      needsTransport: choice === "yes",
      participantName: choice === "yes" ? name : null,
    });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Confira sua resposta."); return; }
    setSending(true);
    try {
      const result = await submitTransportResponse({ data: parsed.data });
      if (!result.ok) { setError("Uma resposta já foi registrada para este nome ou envio."); return; }
      setDone(true);
      setName("");
      try { localStorage.setItem(RECEIPT_KEY, "sent"); } catch { /* Response is already saved. */ }
    } catch { setError("Não foi possível enviar. Tente novamente em instantes."); }
    finally { setSending(false); }
  }

  return (
    <section className="border-b border-primary/30 bg-primary/10" aria-labelledby="transport-heading">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start gap-4">
          <BusFront className="mt-1 size-9 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-bold uppercase text-primary">Enquete de condução</p>
            <h2 id="transport-heading" className="font-display text-2xl font-bold leading-tight sm:text-3xl">Você precisa de condução para a confraternização?</h2>
            {done ? (
              <p role="status" className="mt-5 flex items-start gap-2 font-semibold"><CheckCircle2 className="size-5 shrink-0 text-leaf" />Resposta registrada. Obrigado pela participação!</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 max-w-xl space-y-5">
                <RadioGroup aria-label="Precisa de condução?" value={choice} onValueChange={(value) => { setChoice(value); setError(null); }} className="flex gap-8" disabled={sending}>
                  <label className="flex cursor-pointer items-center gap-3 text-lg font-semibold" htmlFor="transport-yes"><RadioGroupItem id="transport-yes" value="yes" className="size-5" />Sim</label>
                  <label className="flex cursor-pointer items-center gap-3 text-lg font-semibold" htmlFor="transport-no"><RadioGroupItem id="transport-no" value="no" className="size-5" />Não</label>
                </RadioGroup>
                {choice === "yes" && (
                  <div>
                    <label htmlFor="transport-name" className="mb-2 block font-semibold">Seu nome completo <span className="text-sm font-normal">(obrigatório)</span></label>
                    <input id="transport-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} disabled={sending} aria-required="true" aria-describedby={error ? "transport-error" : undefined} className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    <p className="mt-2 text-sm text-foreground/75">Seu nome ficará disponível somente para a organização.</p>
                  </div>
                )}
                {error && <p id="transport-error" role="alert" className="font-medium text-destructive">{error}</p>}
                <Button type="submit" size="lg" disabled={sending} className="h-12"><Send aria-hidden="true" />{sending ? "Enviando…" : "Enviar resposta"}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}