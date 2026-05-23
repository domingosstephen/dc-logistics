"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const countries = [
  // Europe
  { code: "IT", name: "Italy", cx: 520, cy: 195, primary: true },
  { code: "DE", name: "Germany", cx: 495, cy: 140, primary: true },
  { code: "FR", name: "France", cx: 440, cy: 170, primary: true },
  { code: "ES", name: "Spain", cx: 405, cy: 210, primary: true },
  { code: "AT", name: "Austria", cx: 520, cy: 155, primary: false },
  { code: "CH", name: "Switzerland", cx: 475, cy: 165, primary: false },
  { code: "NL", name: "Netherlands", cx: 465, cy: 120, primary: false },
  { code: "BE", name: "Belgium", cx: 450, cy: 130, primary: false },
  { code: "PL", name: "Poland", cx: 545, cy: 125, primary: false },
  { code: "GB", name: "UK", cx: 425, cy: 110, primary: false },
  { code: "PT", name: "Portugal", cx: 385, cy: 215, primary: false },
  { code: "HR", name: "Croatia", cx: 535, cy: 185, primary: false },
  { code: "GR", name: "Greece", cx: 555, cy: 225, primary: false },
  // North America
  { code: "US", name: "USA", cx: 150, cy: 160, primary: true },
  { code: "CA", name: "Canada", cx: 155, cy: 105, primary: false },
  { code: "MX", name: "Mexico", cx: 115, cy: 215, primary: false },
  // Central America
  { code: "PA", name: "Panama", cx: 155, cy: 260, primary: false },
  { code: "CR", name: "Costa Rica", cx: 140, cy: 252, primary: false },
  { code: "DO", name: "Dom. Rep.", cx: 195, cy: 235, primary: false },
  // South America
  { code: "BR", name: "Brazil", cx: 240, cy: 330, primary: true },
  { code: "AR", name: "Argentina", cx: 205, cy: 400, primary: false },
  { code: "CO", name: "Colombia", cx: 175, cy: 275, primary: false },
  { code: "CL", name: "Chile", cx: 190, cy: 385, primary: false },
  { code: "PE", name: "Peru", cx: 170, cy: 310, primary: false },
  { code: "EC", name: "Ecuador", cx: 155, cy: 290, primary: false },
  { code: "VE", name: "Venezuela", cx: 200, cy: 265, primary: false },
  { code: "UY", name: "Uruguay", cx: 225, cy: 385, primary: false },
];

const routes = [
  // European routes
  { from: "IT", to: "DE" },
  { from: "IT", to: "FR" },
  { from: "IT", to: "AT" },
  { from: "DE", to: "NL" },
  { from: "DE", to: "PL" },
  { from: "FR", to: "ES" },
  { from: "FR", to: "BE" },
  { from: "IT", to: "HR" },
  { from: "DE", to: "GB" },
  { from: "ES", to: "PT" },
  { from: "IT", to: "GR" },
  // Transatlantic routes (Europe <-> Americas)
  { from: "IT", to: "US" },
  { from: "IT", to: "BR" },
  { from: "DE", to: "US" },
  { from: "ES", to: "MX" },
  { from: "ES", to: "AR" },
  { from: "FR", to: "CA" },
  { from: "GB", to: "US" },
  // Americas internal
  { from: "US", to: "CA" },
  { from: "US", to: "MX" },
  { from: "MX", to: "CR" },
  { from: "US", to: "CO" },
  { from: "US", to: "BR" },
  { from: "CO", to: "EC" },
  { from: "BR", to: "AR" },
  { from: "CO", to: "VE" },
  { from: "PE", to: "CL" },
  { from: "AR", to: "UY" },
];

const getCountryPos = (code: string) => countries.find((c) => c.code === code);

function curvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = dist * 0.18;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
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
      const routePaths = routesRef.current?.querySelectorAll("path") || [];

      routePaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      const dots = dotsRef.current?.querySelectorAll("circle") || [];
      const labels = labelsRef.current?.querySelectorAll("text") || [];
      const glows = glowsRef.current?.querySelectorAll("circle") || [];

      gsap.set(dots, { scale: 0, transformOrigin: "center center" });
      gsap.set(labels, { opacity: 0 });
      gsap.set(glows, { opacity: 0, scale: 0, transformOrigin: "center center" });

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
      tl.to(routePaths, {
        strokeDashoffset: 0,
        duration: 2.2,
        stagger: 0.06,
        ease: "power2.inOut",
      }, 0);

      // Phase 2: Pop in dots
      tl.to(dots, {
        scale: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: "back.out(2)",
      }, 0.4);

      // Phase 3: Fade in glows
      tl.to(glows, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
      }, 0.6);

      // Phase 4: Fade in labels
      tl.to(labels, {
        opacity: 1,
        duration: 0.4,
        stagger: 0.03,
      }, 1.0);

      // Pulsing glow on primary dots
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
        viewBox="50 60 570 400"
        className="w-full max-w-4xl mx-auto"
        fill="none"
      >
        {/* Faint continent outlines */}
        <g opacity={0.04} fill="#20503E">
          {/* North America */}
          <path d="M80,80 L120,75 L170,85 L200,100 L210,130 L200,160 L180,185 L150,200 L130,220 L110,230 L100,250 L95,225 L85,200 L75,170 L70,130 L75,100 Z" />
          {/* Central America */}
          <path d="M100,250 L115,240 L130,245 L145,255 L155,265 L148,270 L135,268 L120,260 Z" />
          {/* South America */}
          <path d="M155,270 L180,265 L210,270 L240,280 L260,310 L265,340 L255,370 L240,395 L220,415 L200,420 L190,405 L185,380 L175,350 L165,320 L155,295 Z" />
          {/* Europe */}
          <path d="M400,90 L430,85 L460,95 L490,100 L520,95 L550,105 L570,120 L575,145 L565,170 L555,195 L540,215 L520,230 L500,225 L480,215 L460,200 L440,185 L420,175 L405,160 L395,140 L390,115 Z" />
          {/* UK */}
          <path d="M415,95 L425,100 L430,115 L425,125 L415,120 L410,108 Z" />
          {/* Iberian */}
          <path d="M390,185 L410,180 L425,190 L420,215 L405,225 L385,220 L380,205 Z" />
          {/* Italian peninsula */}
          <path d="M500,185 L510,195 L520,210 L525,225 L515,235 L505,225 L500,210 L498,195 Z" />
        </g>

        {/* Atlantic Ocean label */}
        <text x="310" y="200" textAnchor="middle" className="text-[9px] fill-pine/10 font-medium tracking-[0.3em]">
          ATLANTIC
        </text>

        {/* Route paths */}
        <g ref={routesRef}>
          {routes.map((route) => {
            const from = getCountryPos(route.from);
            const to = getCountryPos(route.to);
            if (!from || !to) return null;
            const isTransatlantic =
              (from.cx < 300 && to.cx > 350) || (from.cx > 350 && to.cx < 300);
            return (
              <path
                key={`${route.from}-${route.to}`}
                data-route={`${route.from}-${route.to}`}
                d={curvedPath(from.cx, from.cy, to.cx, to.cy)}
                stroke={isTransatlantic ? "#E0A04B" : "#20503E"}
                strokeWidth={isTransatlantic ? 1.2 : 1.5}
                strokeOpacity={isTransatlantic ? 0.25 : 0.35}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={isTransatlantic ? "6 4" : "none"}
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
              r={country.primary ? 14 : 10}
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
              r={country.primary ? 5 : 3.5}
              fill="#20503E"
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
              y={country.cy - (country.primary ? 16 : 12)}
              textAnchor="middle"
              className={`font-medium ${
                country.primary
                  ? "text-[9px] fill-pine"
                  : "text-[7px] fill-ink/40"
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
