import { Section } from "@/components/layout/section";

const stats = [
  { value: "2,500+", label: "Pet trasportati con successo" },
  { value: "100%", label: "Conforme al passaporto EU" },
  { value: "24/7", label: "Monitoraggio e assistenza" },
];

export function TrustBar() {
  return (
    <div className="bg-mist border-y border-pine/5">
      <Section className="!py-10 md:!py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-pine/10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-6">
              <p className="font-display text-3xl md:text-4xl font-semibold text-pine">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
