"use client";

import { useEffect, useRef, useState } from "react";

const countries = [
  { code: "IT", name: "Italia", cx: 280, cy: 280 },
  { code: "DE", name: "Germania", cx: 260, cy: 180 },
  { code: "FR", name: "Francia", cx: 180, cy: 240 },
  { code: "ES", name: "Spagna", cx: 120, cy: 320 },
  { code: "AT", name: "Austria", cx: 290, cy: 200 },
  { code: "CH", name: "Svizzera", cx: 240, cy: 220 },
  { code: "NL", name: "Paesi Bassi", cx: 230, cy: 150 },
  { code: "BE", name: "Belgio", cx: 215, cy: 165 },
  { code: "PL", name: "Polonia", cx: 330, cy: 160 },
  { code: "CZ", name: "Rep. Ceca", cx: 300, cy: 185 },
  { code: "HR", name: "Croazia", cx: 310, cy: 250 },
  { code: "SI", name: "Slovenia", cx: 300, cy: 235 },
  { code: "HU", name: "Ungheria", cx: 330, cy: 215 },
  { code: "GB", name: "Regno Unito", cx: 175, cy: 130 },
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

export function EuropeMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  const getCountryPos = (code: string) =>
    countries.find((c) => c.code === code);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox="60 80 360 300"
        className="w-full max-w-2xl mx-auto"
        fill="none"
      >
        {/* Routes */}
        {routes.map((route) => {
          const from = getCountryPos(route.from);
          const to = getCountryPos(route.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${route.from}-${route.to}`}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke="#20503E"
              strokeWidth={1.5}
              strokeOpacity={0.2}
              strokeDasharray="4 4"
              className={inView ? "animate-draw-line" : ""}
            />
          );
        })}

        {/* Country dots */}
        {countries.map((country, i) => (
          <g key={country.code}>
            {/* Glow */}
            <circle
              cx={country.cx}
              cy={country.cy}
              r={12}
              fill="#20503E"
              fillOpacity={0.08}
              className={inView ? "animate-pulse-slow" : ""}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
            {/* Dot */}
            <circle
              cx={country.cx}
              cy={country.cy}
              r={5}
              fill="#20503E"
              className={`transition-all duration-700 ${
                inView ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{
                transitionDelay: `${i * 0.08}s`,
                transformOrigin: `${country.cx}px ${country.cy}px`,
              }}
            />
            {/* Label */}
            <text
              x={country.cx}
              y={country.cy - 14}
              textAnchor="middle"
              className={`text-[9px] fill-ink/60 font-medium transition-opacity duration-500 ${
                inView ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 0.08 + 0.3}s` }}
            >
              {country.name}
            </text>
          </g>
        ))}
      </svg>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.08; r: 12; }
          50% { opacity: 0.15; r: 16; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
