import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props { params: Promise<{ lang: string }> }

const PROHIBITED_PT = [
  {
    category: "Proibidos — nunca aceitos",
    items: [
      "Explosivos, munições e seus componentes",
      "Armas de fogo e peças de armas",
      "Entorpecentes e substâncias psicotrópicas ilegais",
      "Material biológico de risco nível 3 ou 4 (BSL-3/BSL-4)",
      "Material nuclear e radioativo fora dos parâmetros IAEA",
      "Artigos falsificados ou pirateados",
      "Mercadoria objeto de sanção econômica internacional",
      "Resíduos perigosos para descarte (Classe 9 — resíduos)",
      "Animais vivos, exceto conforme regulamentação CITES/IBAMA aprovada caso a caso",
    ],
  },
  {
    category: "Restritos — aceitos somente com documentação prévia",
    items: [
      "Produtos perecíveis com controle de temperatura (exige embalagem adequada e aprovação prévia)",
      "Produtos farmacêuticos e medicamentos sujeitos a controle da Anvisa",
      "Equipamentos de comunicação e transmissão (exige homologação Anatel no destino)",
      "Produtos de beleza e cosméticos sujeitos a licenciamento no país de destino",
      "Carga perigosa (DG) conforme IATA DGR / IMDG — exige declaração do expedidor e aprovação prévia",
      "Obras de arte e objetos de valor cultural (exige autorização do IPHAN quando aplicável)",
      "Bebidas alcoólicas — restrições variam por país de destino",
      "Tabaco e derivados — restrições variam por país de destino",
      "Dinheiro em espécie, metais preciosos e pedras preciosas (exige declaração aduaneira específica)",
      "Equipamentos de duplo uso (civil e militar) — sujeitos a controle de exportação",
    ],
  },
]

const PROHIBITED_EN = [
  {
    category: "Prohibited — never accepted",
    items: [
      "Explosives, ammunition, and their components",
      "Firearms and firearm parts",
      "Illegal narcotics and psychotropic substances",
      "Biological material at biosafety level 3 or 4 (BSL-3/BSL-4)",
      "Nuclear and radioactive material outside IAEA parameters",
      "Counterfeit or pirated goods",
      "Goods subject to international economic sanctions",
      "Hazardous waste for disposal (Class 9 — waste)",
      "Live animals, except under approved CITES documentation handled case by case",
    ],
  },
  {
    category: "Restricted — accepted only with prior documentation",
    items: [
      "Temperature-sensitive perishables (requires appropriate packaging and prior approval)",
      "Pharmaceutical products and medicines subject to regulatory control at destination",
      "Communication and transmission equipment (may require type approval at destination)",
      "Cosmetics and beauty products subject to licensing at destination",
      "Dangerous goods (DG) per IATA DGR / IMDG — requires shipper's declaration and prior approval",
      "Works of art and cultural property (may require export authorisation from origin country)",
      "Alcoholic beverages — restrictions vary by destination country",
      "Tobacco and tobacco products — restrictions vary by destination country",
      "Cash, precious metals, and precious stones (requires specific customs declaration)",
      "Dual-use equipment (civil and military) — subject to export controls",
    ],
  },
]

export default async function ProhibitedItemsPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const isPt = lang === "pt";
  const sections = isPt ? PROHIBITED_PT : PROHIBITED_EN;

  return (
    <main className="mx-auto max-w-[800px] px-5 md:px-8 py-18 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-deep mb-4">{dict.legal.prohibitedH1}</h1>
      <p className="text-steel mb-12 leading-relaxed max-w-xl">
        {isPt
          ? "Esta lista não é exaustiva. As regulamentações aduaneiras variam por país e mudam com frequência. Em caso de dúvida sobre um item específico, consulte a equipe antes do embarque — uma declaração incorreta pode resultar em retenção, multa ou devolução da carga."
          : "This list is not exhaustive. Customs regulations vary by country and change frequently. If in doubt about a specific item, consult the team before dispatch — an incorrect declaration can result in a hold, fine, or return of the cargo."}
      </p>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.category}>
            <h2 className="font-mono text-[11px] tracking-widest text-steel uppercase mb-4">
              {section.category}
            </h2>
            <ul className="border-t-2 border-t-deep divide-y divide-border">
              {section.items.map((item) => (
                <li key={item} className="py-3 flex gap-4 text-sm text-ink">
                  <span className="shrink-0 mt-0.5 text-steel">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-sm text-steel">
          {isPt
            ? "Dúvidas sobre um item específico? Escreva para info@dclogisticsbrasil.br.com antes de despachar."
            : "Questions about a specific item? Email info@dclogisticsbrasil.br.com before dispatching."}
        </p>
      </div>
    </main>
  );
}
