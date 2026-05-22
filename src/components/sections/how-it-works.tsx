"use client";

import { Section, SectionHeader } from "@/components/layout/section";
import { motion } from "motion/react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  dict: Dictionary;
}

const icons = [
  <svg key="1" className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h16a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
    <path strokeLinecap="round" d="M12 16h8M12 20h5M6 12h20" />
  </svg>,
  <svg key="2" className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 4l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>,
  <svg key="3" className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h24M8 24h2M22 24h2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20l2-8h16l2 8" />
    <circle cx="10" cy="24" r="2" /><circle cx="22" cy="24" r="2" />
  </svg>,
  <svg key="4" className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 28s-9-5.5-9-13a9 9 0 0118 0c0 7.5-9 13-9 13z" />
    <circle cx="16" cy="15" r="3" />
  </svg>,
];

export function HowItWorksSection({ dict }: Props) {
  const steps = [
    { number: "01", title: dict.howItWorks.step1Title, description: dict.howItWorks.step1Desc },
    { number: "02", title: dict.howItWorks.step2Title, description: dict.howItWorks.step2Desc },
    { number: "03", title: dict.howItWorks.step3Title, description: dict.howItWorks.step3Desc },
    { number: "04", title: dict.howItWorks.step4Title, description: dict.howItWorks.step4Desc },
  ];

  return (
    <Section id="how-it-works">
      <SectionHeader title={dict.howItWorks.title} />
      <div className="relative">
        <div className="hidden lg:block absolute top-[4.25rem] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-pine/5 via-pine/15 to-pine/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative bg-mist rounded-2xl p-8 group hover:shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-pine/10 flex items-center justify-center text-pine mb-5 group-hover:bg-pine group-hover:text-paper transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]">
                {icons[i]}
              </div>
              <span className="font-display text-sm text-honey font-semibold">{step.number}</span>
              <h3 className="font-display text-xl font-semibold text-ink mt-1 mb-3">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
