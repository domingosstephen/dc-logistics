"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function HeroSection({ lang, dict }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const pawRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: 50,
          x: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (pawRef.current) {
        gsap.to(pawRef.current, {
          y: -15,
          rotation: 5,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-pine-deep grain"
    >
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-dogs.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pine-deep/95 via-pine-deep/80 to-pine-deep/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/60 via-transparent to-pine-deep/30" />
      </div>
      <div ref={orb1Ref} className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-honey/5 blur-3xl" />
      <div ref={orb2Ref} className="absolute bottom-10 left-[5%] w-[300px] h-[300px] rounded-full bg-sky/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-honey font-medium text-sm tracking-widest uppercase mb-6"
          >
            {lang === "it" ? "Trasporto Premium per Animali" : lang === "de" ? "Premium-Tiertransport" : lang === "es" ? "Transporte Premium de Mascotas" : "Premium Pet Transport"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-paper leading-[1.1] tracking-tight"
          >
            {dict.hero.title.includes("attraverso") || dict.hero.title.includes("Across") || dict.hero.title.includes("durch") || dict.hero.title.includes("por") ? (
              <>
                {dict.hero.title.split(/attraverso|Across|durch|por/)[0]}
                <br />
                <span className="text-honey">
                  {lang === "it" ? "attraverso l'Europa" : lang === "de" ? "durch Europa" : lang === "es" ? "por Europa" : "Across Europe"}
                </span>
              </>
            ) : (
              dict.hero.title
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-lg sm:text-xl text-paper/70 max-w-xl leading-relaxed"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href={`/${lang}/track`}
              className="group inline-flex items-center justify-center rounded-full bg-honey px-8 py-3.5 text-base font-semibold text-pine-deep hover:bg-honey/90 transition-all shadow-lg shadow-honey/20 hover:shadow-xl hover:shadow-honey/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {dict.hero.trackCta}
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href={`/${lang}/quote`}
              className="inline-flex items-center justify-center rounded-full border-2 border-paper/30 px-8 py-3.5 text-base font-semibold text-paper hover:bg-paper/10 hover:border-paper/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {dict.hero.quoteCta}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute bottom-10 right-10 lg:right-20 hidden md:block"
        >
          <div ref={pawRef}>
            <PawSVG className="w-32 h-32 text-paper/10" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="absolute top-32 right-[25%] hidden lg:block"
        >
          <PawSVG className="w-16 h-16 text-paper/5 rotate-[-20deg]" />
        </motion.div>
      </div>

    </section>
  );
}

function PawSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="currentColor">
      <ellipse cx="35" cy="22" rx="11" ry="13" />
      <ellipse cx="65" cy="15" rx="9" ry="12" />
      <ellipse cx="87" cy="30" rx="8" ry="11" />
      <ellipse cx="20" cy="47" rx="9" ry="11" />
      <ellipse cx="55" cy="58" rx="22" ry="28" />
    </svg>
  );
}
