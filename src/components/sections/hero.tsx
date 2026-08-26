"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { TrackingSearch } from "@/components/tracking/tracking-search";
import { RouteMap } from "@/components/sections/route-map";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  lang: Locale;
  dict: Dictionary;
}

export function HeroSection({ lang, dict }: Props) {
  return (
    <section className="relative bg-deep overflow-hidden">
      {/* Background photo — mobile only */}
      <Image
        src="/hero-logistics.jpg"
        alt=""
        fill
        className="object-cover object-center lg:hidden"
        priority
        aria-hidden="true"
      />
      {/* Dark overlay on photo so text stays legible — mobile only */}
      <div className="absolute inset-0 bg-deep/70 lg:hidden pointer-events-none" />

      {/* Dot grid — desktop */}
      <div
        className="absolute inset-0 hidden lg:block pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          <div>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-[11px] font-mono tracking-widest text-white/60 uppercase">
                {lang === "pt" ? "Rastreamento em tempo real" : "Real-time tracking"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-white leading-[1.1] tracking-tight"
            >
              {dict.hero.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-base md:text-lg text-white/60 leading-relaxed max-w-lg"
            >
              {dict.hero.subline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4"
            >
              <TrackingSearch lang={lang} dict={dict} heroVariant />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 flex items-center gap-4"
            >
              <Link href={`/${lang}/quote`} className="text-sm text-white/50 hover:text-white transition-colors">
                {dict.hero.quoteLink} →
              </Link>
              <span className="text-white/20">|</span>
              <Link href={`/${lang}/services`} className="text-sm text-white/50 hover:text-white transition-colors">
                {lang === "pt" ? "Ver serviços" : "View services"} →
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:block h-[360px]"
          >
            <RouteMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
