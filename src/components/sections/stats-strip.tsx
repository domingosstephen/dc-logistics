import type { Locale } from "@/app/[lang]/dictionaries";

const STATS_PT = [
  { value: "50+", label: "países e territórios atendidos" },
  { value: "5+", label: "anos de operação logística" },
  { value: "48h", label: "prazo para retornar sua cotação" },
  { value: "100%", label: "dos envios rastreados em tempo real" },
];

const STATS_EN = [
  { value: "50+", label: "countries and territories served" },
  { value: "5+", label: "years of logistics operations" },
  { value: "48h", label: "to return your quote" },
  { value: "100%", label: "of shipments tracked in real time" },
];

interface Props {
  lang: Locale;
}

export function StatsStrip({ lang }: Props) {
  const stats = lang === "pt" ? STATS_PT : STATS_EN;
  return (
    <div className="bg-deep">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/10">
        {stats.map((s) => (
          <div key={s.value} className="flex flex-col items-center text-center md:px-8">
            <span className="font-display text-4xl font-bold text-signal mb-1">{s.value}</span>
            <span className="text-xs text-white/60 leading-snug max-w-[120px]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
