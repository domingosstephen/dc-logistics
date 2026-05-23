"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const countries = [
  { code: "IT", name: "Italia", cx: 280, cy: 280, primary: true },
  { code: "DE", name: "Germania", cx: 260, cy: 180, primary: true },
  { code: "FR", name: "Francia", cx: 180, cy: 240, primary: true },
  { code: "ES", name: "Spagna", cx: 120, cy: 320, primary: true },
  { code: "AT", name: "Austria", cx: 290, cy: 200, primary: false },
  { code: "CH", name: "Svizzera", cx: 240, cy: 220, primary: false },
  { code: "NL", name: "Paesi Bassi", cx: 230, cy: 150, primary: false },
  { code: "BE", name: "Belgio", cx: 215, cy: 165, primary: false },
  { code: "PL", name: "Polonia", cx: 330, cy: 160, primary: false },
  { code: "CZ", name: "Rep. Ceca", cx: 300, cy: 185, primary: false },
  { code: "HR", name: "Croazia", cx: 310, cy: 250, primary: false },
  { code: "SI", name: "Slovenia", cx: 300, cy: 235, primary: false },
  { code: "HU", name: "Ungheria", cx: 330, cy: 215, primary: false },
  { code: "GB", name: "Regno Unito", cx: 175, cy: 130, primary: false },
];

const routes = [
  { from: "IT", to: "DE" },
  { from: "IT", to: "FR" },
  { from: "IT", to: "AT" },
  { from: "IT", to: "CH" },
  { from: "DE", to: "NL" },
  { from: "DE", to: "PL" },
  { from: "FR", to: "ES" },
  { from: "FR", to: "BE" },
  { from: "AT", to: "HU" },
  { from: "IT", to: "SI" },
  { from: "IT", to: "HR" },
  { from: "DE", to: "GB" },
];

const getCountryPos = (code: string) => countries.find((c) => c.code === code);

// Compute a curved path between two points
function curvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Offset the control point perpendicular to the line
  const offset = Math.sqrt(dx * dx + dy * dy) * 0.15;
  const cx = mx - (dy / Math.sqrt(dx * dx + dy * dy)) * offset;
  const cy = my + (dx / Math.sqrt(dx * dx + dy * dy)) * offset;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

export function EuropeMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const routesRef = useRef<SVGGElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<SVGGElement>(null);
  const glowsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !svgRef.current) return;

    const ctx = gsap.context(() => {
      // Get all route paths
      const routePaths =
        routesRef.current?.querySelectorAll("path") || [];

      // Set initial state: routes hidden via stroke-dashoffset
      routePaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      // Dots and labels start hidden
      const dots = dotsRef.current?.querySelectorAll("circle") || [];
      const labels = labelsRef.current?.querySelectorAll("text") || [];
      const glows = glowsRef.current?.querySelectorAll("circle") || [];

      gsap.set(dots, { scale: 0, transformOrigin: "center center" });
      gsap.set(labels, { opacity: 0 });
      gsap.set(glows, { opacity: 0, scale: 0, transformOrigin: "center center" });

      // Main timeline — plays once when map enters view (not scrub-linked)
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => tl.play(),
        },
      });

      // Phase 1: Draw routes
      tl.to(
        routePaths,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          stagger: 0.08,
          ease: "power2.inOut",
        },
        0
      );

      // Phase 2: Pop in dots
      tl.to(
        dots,
        {
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "back.out(2)",
        },
        0.4
      );

      // Phase 3: Fade in glows
      tl.to(
        glows,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.6
      );

      // Phase 4: Fade in labels
      tl.to(
        labels,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
        },
        1.0
      );

      // Pulsing glow animation on primary country dots (loops after timeline)
      const primaryGlows = Array.from(glows).filter((_, i) =>
        countries[i]?.primary
      );
      gsap.to(primaryGlows, {
        scale: 1.4,
        opacity: 0.2,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox="60 80 360 300"
        className="w-full max-w-2xl mx-auto"
        fill="none"
      >
        {/* Route paths */}
        <g ref={routesRef}>
          {routes.map((route) => {
            const from = getCountryPos(route.from);
            const to = getCountryPos(route.to);
            if (!from || !to) return null;
            return (
              <path
                key={`${route.from}-${route.to}`}
                data-route={`${route.from}-${route.to}`}
                d={curvedPath(from.cx, from.cy, to.cx, to.cy)}
                stroke="#20503E"
                strokeWidth={1.8}
                strokeOpacity={0.35}
                fill="none"
                strokeLinecap="round"
                style={{ opacity: 0 }}
              />
            );
          })}
        </g>

        {/* Glow circles */}
        <g ref={glowsRef}>
          {countries.map((country) => (
            <circle
              key={`glow-${country.code}`}
              cx={country.cx}
              cy={country.cy}
              r={country.primary ? 16 : 12}
              fill={country.primary ? "#E0A04B" : "#20503E"}
              fillOpacity={0.1}
            />
          ))}
        </g>

        {/* Country dots */}
        <g ref={dotsRef}>
          {countries.map((country) => (
            <circle
              key={`dot-${country.code}`}
              cx={country.cx}
              cy={country.cy}
              r={country.primary ? 6 : 4.5}
              fill={country.primary ? "#20503E" : "#20503E"}
              stroke={country.primary ? "#E0A04B" : "none"}
              strokeWidth={country.primary ? 2 : 0}
            />
          ))}
        </g>

        {/* Labels */}
        <g ref={labelsRef}>
          {countries.map((country) => (
            <text
              key={`label-${country.code}`}
              x={country.cx}
              y={country.cy - (country.primary ? 18 : 14)}
              textAnchor="middle"
              className={`font-medium ${
                country.primary
                  ? "text-[10px] fill-pine"
                  : "text-[8px] fill-ink/50"
              }`}
            >
              {country.name}
            </text>
          ))}
        </g>

      </svg>
    </div>
  );
}
