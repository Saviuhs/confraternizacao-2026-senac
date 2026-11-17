import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Car, CheckCircle2, Clock, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { attendanceSchema } from "@/lib/attendance-schema";
import { isAttendanceClosed } from "@/lib/attendance-schedule";
import { submitAttendance } from "@/lib/attendance.functions";

const RECEIPT_KEY = "senac-attendance-response";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confraternização Senac Pindamonhangaba 04/12/2026 — Confirme sua presença" },
      { name: "description", content: "Confraternização Senac Pindamonhangaba em 04/12/2026, a partir das 18h30, no Intercity Pátio Pinda. Confirme sua presença até 27/11." },
      { property: "og:title", content: "Confraternização Senac Pindamonhangaba 04/12/2026" },
      { property: "og:description", content: "04/12/2026 às 18h30 no Intercity Pátio Pinda Hotel & Resort. Confirme sua presença até 27/11." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://confraternizacao-2026-senac.lovable.app/convite-confraternizacao.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://confraternizacao-2026-senac.lovable.app/convite-confraternizacao.jpg" },
    ],
  }),
  component: Index,
});

function Index() {
  const [choice, setChoice] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseId = useRef<string | null>(null);

  useEffect(() => {
    try { setDone(localStorage.getItem(RECEIPT_KEY) === "sent"); } catch { /* opcional */ }
    const check = () => setClosed(isAttendanceClosed());
    check();
    const t = window.setInterval(check, 1000);
    return () => window.clearInterval(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!choice) { setError("Selecione se vai ou não participar."); return; }
    responseId.current ??= crypto.randomUUID();
    const parsed = attendanceSchema.safeParse({ responseId: responseId.current, willAttend: choice === "yes", participantName: name });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Confira sua resposta."); return; }
    setSending(true);
    try {
      const r = await submitAttendance({ data: parsed.data });
      if (!r.ok) {
        if (r.reason === "closed") { setClosed(true); return; }
        setError("Este nome já confirmou resposta. Cada pessoa pode responder uma única vez.");
        return;
      }
      setDone(true);
      try { localStorage.setItem(RECEIPT_KEY, "sent"); } catch { /* já salvo */ }
    } catch { setError("Não foi possível enviar. Tente novamente em instantes."); }
    finally { setSending(false); }
  }

  const info = [
    { icon: CalendarDays, label: "Quando?", text: "Dia 04/12/2026" },
    { icon: Clock, label: "Que horas?", text: "A partir das 18h30" },
    { icon: MapPin, label: "Onde?", text: "Intercity Pátio Pinda Hotel & Resort — R. Alcides Ramos Nogueira, 782, Pindamonhangaba - SP. Em frente ao Shopping Pátio Pinda." },
    { icon: Car, label: "Estacionamento", text: "Interno a R$ 20,00 (valor fixo); também é possível estacionar gratuitamente no entorno." },
  ];

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <span className="font-display text-lg font-semibold text-primary">Confraternização Senac Pindamonhangaba 04/12/2026</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <img src="/convite-confraternizacao.jpg" alt="Convite da confraternização de fim de ano do Senac Pindamonhangaba" width={1357} height={1920} className="w-full rounded-2xl border border-border shadow-2xl" />

        <div className="space-y-8">
          <div>
            <p className="font-semibold text-primary">Oi gente! Tá chegando o grande dia!</p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">Nossa confraternização de fim de ano!</h1>
          </div>

          <ul className="space-y-4 rounded-2xl border border-border bg-card p-6">
            {info.map(({ icon: Icon, label, text }) => (
              <li key={label} className="flex gap-4">
                <Icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                <p><strong className="text-primary">{label}</strong> {text}</p>
              </li>
            ))}
          </ul>

          <section aria-labelledby="rsvp-heading" className="rounded-2xl border-2 border-primary bg-card p-6">
            <h2 id="rsvp-heading" className="font-display text-2xl font-semibold text-primary">Confirmação de presença</h2>
            <p className="mt-1 text-muted-foreground">Responda até 27/11/2026, às 23h59 (horário de Brasília).</p>
            {closed ? (
              <p role="status" className="mt-5 font-semibold">O prazo para confirmar presença terminou em 27/11/2026. Obrigado!</p>
            ) : done ? (
              <p role="status" className="mt-5 flex items-start gap-2 font-semibold"><CheckCircle2 className="size-5 shrink-0 text-primary" />Resposta registrada. Obrigado!</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <RadioGroup aria-label="Você vai participar?" value={choice} onValueChange={(v) => { setChoice(v); setError(null); }} className="space-y-3" disabled={sending}>
                  <label htmlFor="rsvp-yes" className="flex cursor-pointer items-center gap-3 text-lg font-semibold"><RadioGroupItem id="rsvp-yes" value="yes" className="size-5" />Vou participar</label>
                  <label htmlFor="rsvp-no" className="flex cursor-pointer items-center gap-3 text-lg font-semibold"><RadioGroupItem id="rsvp-no" value="no" className="size-5" />Não vou participar</label>
                </RadioGroup>
                <div>
                  <label htmlFor="rsvp-name" className="mb-2 block font-semibold">Nome completo <span className="text-sm font-normal text-muted-foreground">(obrigatório)</span></label>
                  <input id="rsvp-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} disabled={sending} aria-required="true" placeholder="Ex.: Maria Silva" className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                {error && <p role="alert" className="font-medium text-destructive">{error}</p>}
                <Button type="submit" size="lg" disabled={sending} className="h-12"><Send aria-hidden="true" />{sending ? "Enviando…" : "Confirmar resposta"}</Button>
              </form>
            )}
          </section>
          <p className="text-center text-muted-foreground">Vem com tudo e bora fazer dessa confraternização um dia inesquecível!</p>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted-foreground sm:px-8">Confraternização Senac Pindamonhangaba 04/12/2026</div>
      </footer>
    </div>
  );
}
