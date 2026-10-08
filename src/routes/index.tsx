import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import {
  castVote,
  getVoteCounts,
  type OptionId,
} from "@/lib/votes.functions";
import { getVotingCountdown, isVotingClosed } from "@/lib/voting-schedule";
import { Button } from "@/components/ui/button";

const imgFloresta = { url: "/venues/casa-floresta.jpg" };
const imgColmeia = { url: "/venues/colmeia.jpg" };
const imgEspetinhos = { url: "/venues/espetinhos.jpg" };
const imgIntercity = { url: "/venues/intercity.jpg" };
const imgArmazem = { url: "/venues/armazem-fazenda.png" };

const OPTIONS: {
  id: OptionId;
  name: string;
  address: string;
  distance: string;
  description: string;
  menu: string;
  comfort: string;
  spaceScore: number;
  foodScore: number;
  parkingScore: number;
  services: string;
  conditions: string;
  price?: string;
  transportNotice?: string;
  image: string;
  barClass: string;
}[] = [
  {
    id: "churrascaria",
    name: "Casa Floresta",
    address: "Avenida Luiz Gonzaga das Neves, 2600 — Tremembé, São Paulo",
    distance: "Aproximadamente 17,8 km · 32 min do Senac",
    description: "Buffet completo com estação de pratos quentes, áreas cobertas e ao ar livre.",
    menu: "Aperitivos e estação de saladas. Pratos quentes: arroz, arroz carreteiro, feijão-branco com calabresa, farofa crocante, lasanha de queijo ou ao sugo, penne ao molho branco com bacon, iscas de frango crocantes, iscas de peixe, ratatouille de legumes, brócolis e couve gratinados, pernil à moda da casa, almôndegas, carne de panela, coxinha, bolinha de queijo, polenta, mandioca e batata frita. Bebidas: água, sucos naturais e refrigerantes.",
    comfort: "Dois aparadores de madeira, seis réchauds prateados, mesas de madeira, cadeiras de três modelos, pratos brancos e talheres de inox.",
    spaceScore: 2,
    foodScore: 3,
    parkingScore: 3,
    services: "Ambiente com áreas cobertas e ao ar livre; equipe de garçons para atendimento aos convidados.",
    conditions: "Possibilidade de transporte, conforme a necessidade e o interesse dos participantes.",
    price: "R$ 23.310,00; DJ: R$ 3.000,00. Total: R$ 26.310,00.",
    transportNotice: "Possibilidade de transporte, conforme a necessidade e o interesse dos participantes.",
    image: imgFloresta.url,
    barClass: "bg-primary",
  },
  {
    id: "restaurante",
    name: "Restaurante Colmeia",
    address: "Estrada Municipal Jesus Antônio de Miranda, 27 — Pindamonhangaba",
    distance: "Aproximadamente 11,8 km · 20 min do Senac",
    description: "Mesa de frios, fogão a lenha, churrasco texano e sobremesas caseiras.",
    menu: "Mesa de frios: defumados (lombo e copa), queijos, salame, azeitonas, ovos de codorna, barquetes de salpicão, palmito, antepasto de berinjela, pães, batatinhas ao molho e com mostarda, saladas e salada coleslaw. Fogão a lenha: mac and cheese, arroz, feijão texano, farofa, batata rústica e mandioca frita. Churrasco texano: brisket Angus, short ribs Angus, beef hump, pork ribs, linguiça defumada e frango defumado. Sobremesas: pavê de chocolate, salada de frutas e doces caseiros. Bebidas: Coca-Cola, guaraná Antarctica, versões zero, água mineral e suco natural da época.",
    comfort: "Salão com gerador de energia, mesas e cadeiras, palco, toalhas, arranjos simples de flores, pratos de sobremesa, recipientes para porções, guardanapos de tecido, talheres, copos, bandejas, travessas e tampos de vidro para frios e doces.",
    spaceScore: 2,
    foodScore: 3,
    parkingScore: 3,
    services: "Ambiente com áreas cobertas e ao ar livre; música ao vivo; limpeza do salão antes e depois; garçons, cozinheira, ajudantes e recepcionista.",
    conditions: "Possibilidade de transporte, conforme a necessidade e o interesse dos participantes.",
    price: "R$ 19.560,00; quatro ônibus: R$ 1.210,00 cada; DJ: R$ 1.500,00. Total: R$ 25.900,00.",
    transportNotice: "Possibilidade de transporte, conforme a necessidade e o interesse dos participantes.",
    image: imgColmeia.url,
    barClass: "bg-gold",
  },
  {
    id: "sitio",
    name: "Espetinhos Futebol Clube",
    address: "Rua Cônego João Antônio da Costa Bueno, 55 — Santana, Pindamonhangaba",
    distance: "Aproximadamente 1,1 km · 3 min do Senac",
    description: "Espetinhos, porções e bebidas, com banda ou DJ incluso.",
    menu: "Variedade de espetinhos e porções. Bebidas: água mineral, suco e refrigerante.",
    comfort: "Mesas e cadeiras de madeira, pratos brancos e talheres de inox.",
    spaceScore: 2,
    foodScore: 3,
    parkingScore: 0,
    services: "Área coberta; equipe de garçons; banda ou DJ inclusos.",
    conditions: "Não há estacionamento.",
    price: "O valor não foi informado; o local informou que consegue atender dentro do orçamento.",
    image: imgEspetinhos.url,
    barClass: "bg-leaf",
  },
  {
    id: "espaco",
    name: "Hotel Intercity Pátio Pinda",
    address: "Rodovia Amador Bueno da Veiga, 2007 — Pindamonhangaba",
    distance: "Aproximadamente 5,8 km · 14 min do Senac",
    description: "Ambiente climatizado, finger food variado e DJ incluso.",
    menu: "Estação de pães; antepastos de sardella e berinjela; salada individual de alface, tomate, pepino e cebola-roxa; mini espetinho de presunto, queijo e azeitona; dadinhos de tapioca com geleia de pimenta; frango crocante; escondidinho de carne; croquetas de cupim recheadas com queijo e aioli; torresmo à pururuca com vinagrete de manga; pastéis de queijo e carne; calabresa acebolada; mandioca frita. Doces: frutas da estação e pudim de leite. Bebidas: água mineral, suco e refrigerante.",
    comfort: "Mesas de madeira, cadeiras de madeira estofadas, pratos brancos, talheres de inox, copos e taças adequados para cada bebida.",
    spaceScore: 3,
    foodScore: 3,
    parkingScore: 0,
    services: "Ambiente climatizado e coberto; equipe de garçons; DJ incluso.",
    conditions: "Estacionamento R$ 12,00. Taxa de rolha: R$ 40,00 (whisky/vodka) e R$ 30,00 (vinhos/espumantes) por garrafa.",
    price: "R$ 21.980,00.",
    image: imgIntercity.url,
    barClass: "bg-foreground/45",
  },
  {
    id: "armazem",
    name: "Armazém da Fazenda — Restaurante e Pizzaria",
    address: "Avenida Nossa Senhora do Bom Sucesso, 4275 — Nossa Senhora do Perpétuo Socorro, Pindamonhangaba",
    distance: "Aproximadamente 8,2 km · 14 min do Senac",
    description: "Pizzas, porções e bebidas, com banda ou DJ incluso.",
    menu: "Entrada: fritas e fritas com queijo. Variedade de pizzas e porções. Bebidas: refrigerantes em lata (Coca-Cola, Guaraná Antarctica, Fanta laranja etc.), sucos (laranja, abacaxi, maracujá, caju, morango etc.) e água com gás e sem gás.",
    comfort: "Mesas de madeira, cadeiras de madeira estofadas, pratos brancos, talheres de inox, copos e taças adequados para cada bebida.",
    spaceScore: 2,
    foodScore: 3,
    parkingScore: 3,
    services: "Ambiente com área coberta; equipe de garçons; banda ou DJ inclusos.",
    conditions: "Estacionamento disponível.",
    image: imgArmazem.url,
    barClass: "bg-primary/70",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confraternização Senac Pindamonhangaba 04/12/2026 — Votação do Local" },
      {
        name: "description",
        content:
           "Professores, votem no local da nossa confraternização de fim de ano. O resultado será divulgado ao encerrar a votação em 08/10/2026.",
      },
      { property: "og:title", content: "Confraternização Senac Pindamonhangaba 04/12/2026" },
      {
        property: "og:description",
        content: "Escolha o lugar da nossa festa de fim de ano. Resultado disponível após o encerramento da votação em 08/10/2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [voterName, setVoterName] = useState("");
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [votedFor, setVotedFor] = useState<OptionId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [countdown, setCountdown] = useState<ReturnType<typeof getVotingCountdown> | null>(null);
  const [counts, setCounts] = useState<Record<OptionId, number> | null>(null);
  const [resultsError, setResultsError] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = Date.now();
      setIsClosed(isVotingClosed(now));
      setCountdown(getVotingCountdown(now));
    };
    check();
    const timer = window.setInterval(check, 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function loadResults() {
    setResultsError(false);
    try {
      const result = await getVoteCounts();
      setCounts(result);
    } catch {
      setResultsError(true);
    }
  }

  useEffect(() => {
    if (isClosed) void loadResults();
  }, [isClosed]);

  const votedOption = OPTIONS.find((o) => o.id === votedFor);
  const totalVotes = counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : 0;
  const rankedOptions = counts
    ? [...OPTIONS].sort((a, b) => counts[b.id] - counts[a.id])
    : [];

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
        if (result.reason === "closed") {
          setIsClosed(true);
          setError("A votação foi encerrada em 08/10/2026. Obrigado pela participação!");
          return;
        }
        setError("Esse nome já votou. Cada professor pode votar uma única vez.");
        return;
      }
      setVotedFor(selected);
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
              Confraternização Senac Pindamonhangaba 04/12/2026
            </span>
          </div>
          <span className="text-xs font-medium text-foreground/55 sm:text-sm">
            {isClosed
              ? "Votação encerrada em 08/10/2026"
               : "Votação até 08/10 às 23h59"}
          </span>
        </div>
      </div>

      {!isClosed && countdown && (
        <section className="border-b border-primary/20 bg-primary/10" aria-label="Prazo da votação">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-lg font-bold">Votações encerram às 23h59 de hoje, 08/10/2026</p>
                <p className="mt-1 text-sm text-foreground/75">Horário de Brasília · Resultado final em 09/10/2026</p>
              </div>
            </div>
            <div role="timer" aria-label="Tempo restante para votar" className="flex shrink-0 items-start gap-3 tabular-nums">
              {([
                ["Horas", countdown.hours],
                ["Minutos", countdown.minutes],
                ["Segundos", countdown.seconds],
              ] as const).map(([label, value]) => (
                <div key={label} className="w-16 text-center">
                  <span className="block font-display text-3xl font-bold leading-tight">{String(value).padStart(2, "0")}</span>
                  <span className="text-xs font-medium text-foreground/70">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* apresentação da votação */}
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:px-8 sm:pt-14">
        <div>
          <div>
            <h1 className="max-w-[24ch] font-display text-4xl font-semibold leading-none tracking-tight text-balance sm:text-5xl">
              Onde será a nossa{" "}
              <span className="italic text-primary">confraternização</span> de fim de
              ano?
            </h1>
            <div className="mt-5 max-w-[80ch] space-y-4 text-base font-bold text-pretty text-foreground sm:text-lg leading-relaxed">
              <p>
                Visando definir o local da nossa confraternização de fim de ano,
                que será realizada em 04/12/2026, convidamos todos e todas a
                participarem da votação.
              </p>
              <p>
                Por gentileza, selecionem a opção que consideram mais adequada. A
                opinião de cada pessoa é fundamental para que possamos escolher o
                local que melhor atenda às preferências do grupo.
              </p>
              <p>
                 Contamos com a participação de todos e todas. A opção mais votada
                será considerada como prioridade, desde que esteja dentro do
                orçamento disponível e atenda aos critérios de contratação. Caso
                não atenda a esses critérios de contratação, seguiremos para o
                próximo, sucessivamente, entre os mais votados.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold">
                  {OPTIONS.length}
                </span>
                <span className="text-sm text-foreground/55">locais em disputa</span>
              </div>
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id;
            return (
              <div
                key={option.id}
                role="button"
                tabIndex={0}
                onClick={() => !votedFor && !isClosed && setSelected(option.id)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !votedFor && !isClosed)
                    setSelected(option.id);
                }}
                aria-pressed={isSelected}
                className={`group rounded-[min(1.4vw,18px)] bg-card p-4 text-left ring-1 transition-transform duration-300 ${
                  votedFor || isClosed ? "" : "cursor-pointer hover:-translate-y-1.5"
                } ${
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
                <p className="mt-2 text-xs font-semibold text-primary">{option.distance}</p>
                <p className="mt-1.5 text-sm text-pretty text-foreground/65">
                  {option.description}
                </p>
                {option.transportNotice && (
                  <p className="mt-3 border-l-4 border-primary bg-primary/10 px-3 py-2 text-sm font-bold leading-snug text-foreground">
                    {option.transportNotice}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-3 gap-1 border-y border-foreground/10 py-2 text-center text-xs font-semibold text-foreground/70">
                  {(
                    [
                      ["Espaço", option.spaceScore],
                      ["Comida", option.foodScore],
                      ["Estacionamento", option.parkingScore],
                    ] as const
                  ).map(([label, score]) => (
                    <div key={label}>
                      <div
                        className="text-[13px] leading-none tracking-tight text-gold"
                        aria-label={`${label}: ${score} de 3`}
                      >
                        {"★".repeat(score)}
                        <span className="text-foreground/25">
                          {"★".repeat(3 - score)}
                        </span>
                      </div>
                      <span className="mt-1 block">{label}</span>
                    </div>
                  ))}
                </div>
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
        {!votedFor && !isClosed && (
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

        {/* voting closed */}
        {!votedFor && isClosed && (
          <div className="mt-8 rounded-[min(1.4vw,18px)] bg-card p-5 text-center ring-1 ring-foreground/5 sm:p-6">
            <p className="font-display text-lg font-semibold tracking-tight">
              Votação encerrada em 08/10/2026
            </p>
            <p className="mt-1.5 text-sm text-foreground/65">
               Obrigado pela participação de todos! Confira o resultado abaixo.
            </p>
          </div>
        )}
      </div>

      {isClosed && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8" aria-labelledby="results-title">
          <h2 id="results-title" className="font-display text-2xl font-semibold sm:text-3xl">Resultado da votação</h2>
          {resultsError ? (
            <div className="mt-4">
              <p className="text-destructive">Não foi possível carregar o resultado.</p>
              <Button variant="outline" className="mt-3" onClick={loadResults}>Tentar novamente</Button>
            </div>
          ) : counts ? (
            <>
              <p className="mt-2 text-sm text-foreground/65">{totalVotes} {totalVotes === 1 ? "voto registrado" : "votos registrados"}</p>
              {totalVotes === 0 && <p className="mt-4">Nenhum voto foi registrado.</p>}
              <ol className="mt-5 divide-y divide-foreground/10">
                {rankedOptions.map((option) => (
                  <li key={option.id} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{option.name}</h3>
                      <span className="text-sm text-foreground/70">
                        {counts[option.id]} {counts[option.id] === 1 ? "voto" : "votos"} · {totalVotes ? (counts[option.id] / totalVotes * 100).toFixed(1).replace(".", ",") : "0,0"}%
                      </span>
                    </div>
                    <progress className="mt-2 h-2 w-full accent-primary" value={counts[option.id]} max={totalVotes || 1} aria-label={`Votos para ${option.name}`} />
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-foreground/65">A opção mais votada será considerada como prioridade, respeitando o orçamento disponível e os critérios de contratação.</p>
            </>
          ) : <p className="mt-4 text-foreground/65" role="status">Carregando resultado…</p>}
        </section>
      )}

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
                   Obrigado por participar — o resultado será divulgado ao encerrar a
                   votação em 08/10/2026 e a confraternização será em 04/12/2026.
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
            Confraternização Senac Pindamonhangaba 04/12/2026 · Associação de Professores
          </span>
          <span className="text-xs text-foreground/40">
            Um voto por professor
          </span>
        </div>
      </div>
    </div>
  );
}
