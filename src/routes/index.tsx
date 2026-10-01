import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { castVote, getVoteCounts, type OptionId } from "@/lib/votes.functions";

import imgFloresta from "@/assets/casa-floresta.jpg.asset.json";
import imgColmeia from "@/assets/colmeia.jpg.asset.json";
import imgEspetinhos from "@/assets/espetinhos.jpg.asset.json";
import imgIntercity from "@/assets/intercity.jpg.asset.json";

const OPTIONS: {
  id: OptionId;
  name: string;
  address: string;
  description: string;
  menu: string;
  comfort: string;
  comfortScore: number;
  services: string;
  conditions: string;
  image: string;
  barClass: string;
}[] = [
  {
    id: "churrascaria",
    name: "Casa Floresta",
    address: "Av. Luiz Gonzaga das Neves, 2600 — Tremembé, São Paulo",
    description: "Buffet completo com estação de pratos quentes, áreas cobertas e ao ar livre.",
    menu: "Aperitivos e estação de salada. Pratos quentes: arroz, arroz carreteiro, feijão branco com calabresa, farofa crocante, lasanha de queijo ou ao sugo, penne ao molho branco com bacon, frango em isca crocante, isca de peixe, ratatouille de legumes, brócolis e couve gratinados, pernil à moda da casa, almôndegas, carne de panela, coxinha, bolinha de queijo, polenta, mandioca e batata frita. Bebidas: água, sucos naturais e refrigerantes.",
    comfort: "2 aparadores de madeira, 6 réchauds prateados, mesas de madeira, cadeiras (3 modelos mistos), pratos brancos e talheres de inox.",
    comfortScore: 2,
    services: "Áreas cobertas e ao ar livre; equipe de garçons.",
    conditions: "Sem DJ; sem transporte.",
    image: imgFloresta.url,
    barClass: "bg-primary",
  },
  {
    id: "restaurante",
    name: "Restaurante Colmeia",
    address: "Estrada Municipal Jesus Antônio de Miranda, 27 — Pindamonhangaba",
    description: "Mesa de frios, fogão a lenha e sobremesas caseiras.",
    menu: "Mesa de frios: defumados (lombo, copa), queijos, salame, azeitonas, ovinho de codorna, barquete de salpicão, palmito, antepasto de berinjela, pães, batatinhas e saladas. Fogão a lenha: tender à Califórnia, fraldinha defumada, filé de frango ao molho de maracujá, macarrão à bolonhesa, arroz, tutu de feijão, farofa, batata e mandioca fritas. Sobremesas: pavê de chocolate, salada de frutas, doces caseiros. Bebidas: refrigerantes (normal e zero), água mineral, suco natural.",
    comfort: "Mesas de madeira, cadeiras (3 modelos mistos), pratos brancos e talheres de inox.",
    comfortScore: 2,
    services: "Áreas cobertas e ao ar livre; equipe de garçons.",
    conditions: "Com DJ ou transporte (um dos dois).",
    image: imgColmeia.url,
    barClass: "bg-gold",
  },
  {
    id: "sitio",
    name: "Espetinhos Futebol Clube",
    address: "R. Cônego João Antônio da Costa Bueno, 55 — Santana, Pindamonhangaba",
    description: "Espetinhos, porções e bebidas, com banda ou DJ incluso.",
    menu: "Espetinhos, porções e bebidas.",
    comfort: "Mesas e cadeiras de madeira, pratos brancos e talheres de inox.",
    comfortScore: 1,
    services: "Área coberta; equipe de garçons; banda ou DJ inclusos.",
    conditions: "Não tem estacionamento.",
    image: imgEspetinhos.url,
    barClass: "bg-leaf",
  },
  {
    id: "espaco",
    name: "Hotel Intercity Pátio Pinda",
    address: "Rodovia Amador Bueno da Veiga, 2007 — Pindamonhangaba",
    description: "Ambiente climatizado, finger food variado e DJ incluso.",
    menu: "Estação de pães, antepastos de sardella e berinjela, saladinha individual, mini espetinho de presunto e queijo, dadinhos de tapioca com geleia de pimenta, frango crocante, escondidinho de carne, croquetas de cupim com queijo, torresmo à pururuca com vinagrete de manga, pastel (queijo/carne), calabresa acebolada, mandioca frita. Doces: frutas da estação e pudim de leite. Bebidas: água mineral, suco e refrigerante.",
    comfort: "Mesas de madeira, cadeiras estofadas, pratos brancos, talheres de inox, copos e taças para cada bebida.",
    comfortScore: 3,
    services: "Ambiente climatizado e coberto; equipe de garçons; DJ incluso.",
    conditions: "Estacionamento R$ 12,00. Taxa de rolha: R$ 40,00 (whisky/vodka) e R$ 30,00 (vinhos/espumantes) por garrafa.",
    image: imgIntercity.url,
    barClass: "bg-foreground/45",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confraria 2026 — Votação da Confraternização dos Professores" },
      {
        name: "description",
        content:
          "Professores, votem no local da nossa confraternização de fim de ano e acompanhem o resultado ao vivo.",
      },
      { property: "og:title", content: "Confraria 2026 — Votação da Confraternização" },
      {
        property: "og:description",
        content: "Escolha o lugar da nossa festa de fim de ano. Cada voto conta!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const { data: counts } = useQuery({
    queryKey: ["vote-counts"],
    queryFn: () => getVoteCounts(),
  });

  const [voterName, setVoterName] = useState("");
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [votedFor, setVotedFor] = useState<OptionId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = OPTIONS.reduce((sum, o) => sum + (counts?.[o.id] ?? 0), 0);
  const votedOption = OPTIONS.find((o) => o.id === votedFor);

  async function handleVote() {
    setError(null);
    if (!selected) {
      setError("Escolha um local antes de confirmar.");
      return;
    }
    if (voterName.trim().length < 3) {
      setError("Digite seu nome completo para votar.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await castVote({
        data: { voterName: voterName.trim(), optionId: selected },
      });
      if (!result.ok) {
        setError("Esse nome já votou. Cada professor pode votar uma única vez.");
        return;
      }
      setVotedFor(selected);
      await queryClient.invalidateQueries({ queryKey: ["vote-counts"] });
    } catch {
      setError("Algo deu errado. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground selection:bg-gold/40">
      {/* top bar */}
      <div className="border-b border-foreground/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
              C
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Confraria 2026
            </span>
          </div>
          <span className="text-xs font-medium text-foreground/55 sm:text-sm">
            Votação aberta até 10 de outubro
          </span>
        </div>
      </div>

      {/* hero: title + live results */}
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:px-8 sm:pt-14">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-leaf/12 px-3 py-1 text-xs font-semibold tracking-wide text-leaf">
              <span className="size-1.5 rounded-full bg-leaf"></span>
              Resultado ao vivo
            </span>
            <h1 className="mt-5 max-w-[24ch] font-display text-4xl font-semibold leading-none tracking-tight text-balance sm:text-5xl">
              Onde será a nossa{" "}
              <span className="italic text-primary">confraternização</span> de fim de
              ano?
            </h1>
            <p className="mt-5 max-w-[46ch] text-sm text-pretty text-foreground/70 sm:text-base">
              Colegas, escolham o lugar onde vamos celebrar juntos. Cada voto conta —
              e o resultado aparece aqui em tempo real.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold">{total}</span>
                <span className="text-sm text-foreground/55">votos apurados</span>
              </div>
              <span className="h-4 w-px bg-foreground/15"></span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold">
                  {OPTIONS.length}
                </span>
                <span className="text-sm text-foreground/55">locais em disputa</span>
              </div>
            </div>
          </div>

          {/* results */}
          <div className="lg:col-span-7">
            <div className="rounded-[min(1.4vw,20px)] bg-card p-5 ring-1 ring-foreground/5 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  Resultado da votação
                </h2>
                <span className="text-xs font-medium text-foreground/45">
                  atualizado ao vivo
                </span>
              </div>
              {OPTIONS.map((option, i) => {
                const votes = counts?.[option.id] ?? 0;
                const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
                return (
                  <div key={option.id} className={i < OPTIONS.length - 1 ? "mb-5" : ""}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-semibold">{option.name}</span>
                      <span className="font-medium tabular-nums text-foreground/70">
                        {votes} votos · {pct}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-foreground/8">
                      <div
                        className={`bar-fill h-full rounded-full ${option.barClass}`}
                        style={{
                          width: `${pct}%`,
                          animationDelay: `${0.05 + i * 0.1}s`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* voting options */}
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Escolha o seu lugar
          </h2>
          <span className="text-sm text-foreground/50">Um voto por professor</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id;
            return (
              <div
                key={option.id}
                role="button"
                tabIndex={0}
                onClick={() => !votedFor && setSelected(option.id)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !votedFor) setSelected(option.id);
                }}
                aria-pressed={isSelected}
                className={`group cursor-pointer rounded-[min(1.4vw,18px)] bg-card p-4 text-left ring-1 transition-transform duration-300 ${votedFor ? "" : "hover:-translate-y-1.5"} ${
                  isSelected ? "ring-2 ring-primary" : "ring-foreground/5"
                }`}
              >
                <img
                  src={option.image}
                  alt={option.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full rounded-[min(1vw,12px)] object-cover outline-1 -outline-offset-1 outline-foreground/5"
                />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {option.name}
                </h3>
                <p className="mt-1 text-xs text-foreground/50">{option.address}</p>
                <p className="mt-1.5 text-sm text-pretty text-foreground/65">
                  {option.description}
                </p>
                <p className="mt-2 text-xs font-semibold text-foreground/70">
                  Conforto:{" "}
                  <span className="text-gold">
                    {"★".repeat(option.comfortScore)}
                    {"☆".repeat(3 - option.comfortScore)}
                  </span>{" "}
                  ({option.comfortScore}/3)
                </p>
                <details
                  className="mt-2 text-xs text-foreground/70"
                  onClick={(e) => e.stopPropagation()}
                >
                  <summary className="cursor-pointer font-semibold text-primary">
                    Ver detalhes
                  </summary>
                  <div className="mt-2 space-y-2">
                    <p><strong>Cardápio:</strong> {option.menu}</p>
                    <p><strong>Estrutura:</strong> {option.comfort}</p>
                    <p><strong>Serviços:</strong> {option.services}</p>
                    <p><strong>Condições:</strong> {option.conditions}</p>
                  </div>
                </details>
                <span
                  className={`mt-4 block w-full rounded-full py-2.5 text-center text-sm font-semibold ring-1 transition-transform duration-200 ${
                    isSelected
                      ? "bg-primary text-primary-foreground ring-primary/40"
                      : "bg-secondary text-secondary-foreground ring-foreground/10 group-hover:scale-[1.02]"
                  }`}
                >
                  {isSelected ? "Selecionado ✓" : "Escolher este"}
                </span>
              </div>
            );
          })}
        </div>

        {/* name + confirm */}
        {!votedFor && (
          <div className="mt-8 rounded-[min(1.4vw,18px)] bg-card p-5 ring-1 ring-foreground/5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="voter-name"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Seu nome completo
                </label>
                <input
                  id="voter-name"
                  type="text"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="Ex.: Maria Silva"
                  maxLength={100}
                  className="w-full rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={handleVote}
                disabled={submitting}
                className="rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-primary/40 transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? "Registrando..." : "Confirmar voto"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* vote confirmation */}
      {votedFor && votedOption && (
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[min(1.6vw,24px)] bg-foreground px-6 py-8 text-background sm:px-10 sm:py-10">
            <span className="floaty absolute -top-6 -right-6 size-24 rounded-full bg-gold/20"></span>
            <span
              className="floaty absolute top-8 right-16 size-3 rounded-full bg-gold/60"
              style={{ animationDelay: "1s" }}
            ></span>
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="vote-pop grid size-16 shrink-0 place-items-center rounded-full bg-gold text-foreground">
                <span className="font-display text-2xl font-semibold">✓</span>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  Voto registrado com sucesso!
                </h2>
                <p className="mt-2 max-w-[48ch] text-sm text-pretty text-background/75 sm:text-base">
                  Você escolheu{" "}
                  <span className="font-semibold text-gold">{votedOption.name}</span>.
                  Obrigado por participar — o resultado final é divulgado no dia 30 de
                  novembro e a confraternização será em 04/12/2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* footer */}
      <div className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 sm:flex-row sm:px-8">
          <span className="text-sm text-foreground/55">
            Confraria 2026 · Associação de Professores
          </span>
          <span className="text-xs text-foreground/40">
            Um voto por professor · resultados em tempo real
          </span>
        </div>
      </div>
    </div>
  );
}
