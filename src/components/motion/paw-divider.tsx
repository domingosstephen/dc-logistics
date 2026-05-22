"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PawDividerProps {
  variant?: "default" | "light";
}

export function PawDivider({ variant = "default" }: PawDividerProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !ref.current) return;

    const paws = ref.current.querySelectorAll(".paw-print");
    gsap.set(paws, { opacity: 0, scale: 0.3, transformOrigin: "center center" });

    const ctx = gsap.context(() => {
      gsap.to(paws, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: 0.1,
        ease: "back.out(2.5)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const color = variant === "light" ? "#20503E" : "#20503E";
  const opacity = variant === "light" ? "0.06" : "0.08";

  return (
    <div className="flex justify-center py-2 overflow-hidden">
      <svg
        ref={ref}
        viewBox="0 0 300 40"
        className="w-48 h-8"
        fill={color}
        fillOpacity={opacity}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 30 + i * 60;
          const y = 20 + Math.sin(i * 1.2) * 6;
          const rot = -20 + i * 10;
          return (
            <g
              key={i}
              className="paw-print"
              transform={`translate(${x}, ${y}) rotate(${rot})`}
            >
              <ellipse cx="0" cy="-4" rx="2.2" ry="2.8" />
              <ellipse cx="4.5" cy="-6" rx="1.8" ry="2.2" />
              <ellipse cx="-4.5" cy="-2.5" rx="1.8" ry="2.2" />
              <ellipse cx="7" cy="-1.5" rx="1.5" ry="2" />
              <ellipse cx="1.5" cy="2.5" rx="4.5" ry="5.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
