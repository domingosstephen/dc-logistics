"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-pine-deep grain">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pine-deep via-pine to-pine-deep/90" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-honey/5 blur-3xl" />
      <div className="absolute bottom-10 left-[5%] w-[300px] h-[300px] rounded-full bg-sky/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-honey font-medium text-sm tracking-widest uppercase mb-6"
          >
            Trasporto Premium per Animali
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-paper leading-[1.1] tracking-tight"
          >
            Zampe sicure
            <br />
            <span className="text-honey">attraverso l&apos;Europa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-lg sm:text-xl text-paper/70 max-w-xl leading-relaxed"
          >
            Trasporto con amore, cure veterinarie certificate e aggiornamenti
            in tempo reale. Perche il tuo pet merita il meglio, ad ogni passo
            del viaggio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/track"
              className="inline-flex items-center justify-center rounded-full bg-honey px-8 py-3.5 text-base font-semibold text-pine-deep hover:bg-honey/90 transition-colors shadow-lg shadow-honey/20"
            >
              Traccia il tuo pet
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-full border-2 border-paper/30 px-8 py-3.5 text-base font-semibold text-paper hover:bg-paper/10 transition-colors"
            >
              Richiedi un preventivo
            </Link>
          </motion.div>

          {/* Paw prints decorative */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-10 right-10 lg:right-20"
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="35" cy="20" r="12" fill="currentColor" className="text-paper" />
              <circle cx="65" cy="12" r="10" fill="currentColor" className="text-paper" />
              <circle cx="88" cy="28" r="9" fill="currentColor" className="text-paper" />
              <circle cx="20" cy="45" r="10" fill="currentColor" className="text-paper" />
              <ellipse cx="55" cy="55" rx="22" ry="28" fill="currentColor" className="text-paper" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
