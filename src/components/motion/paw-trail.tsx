"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PawTrailProps {
  className?: string;
  color?: string;
  count?: number;
}

export function PawTrail({
  className = "",
  color = "#20503E",
  count = 5,
}: PawTrailProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !ref.current) return;

    const paws = ref.current.querySelectorAll(".paw");
    gsap.set(paws, { opacity: 0, scale: 0.5 });

    const ctx = gsap.context(() => {
      gsap.to(paws, {
        opacity: 0.12,
        scale: 1,
        duration: 0.4,
        stagger: 0.15,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const paws = Array.from({ length: count }, (_, i) => ({
    x: 20 + i * 50 + Math.sin(i * 1.2) * 15,
    y: 30 + Math.cos(i * 1.5) * 20,
    rotation: -30 + i * 15 + Math.sin(i) * 10,
    scale: 0.7 + Math.random() * 0.4,
  }));

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${count * 55} 80`}
      className={`pointer-events-none ${className}`}
      fill={color}
    >
      {paws.map((p, i) => (
        <g
          key={i}
          className="paw"
          transform={`translate(${p.x}, ${p.y}) rotate(${p.rotation}) scale(${p.scale})`}
        >
          <ellipse cx="0" cy="-5" rx="2.5" ry="3" />
          <ellipse cx="5" cy="-7" rx="2" ry="2.5" />
          <ellipse cx="-5" cy="-3" rx="2" ry="2.5" />
          <ellipse cx="8" cy="-2" rx="1.8" ry="2.2" />
          <ellipse cx="2" cy="2" rx="5" ry="6" />
        </g>
      ))}
    </svg>
  );
}
