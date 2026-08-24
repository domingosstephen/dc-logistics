"use client";

import { motion } from "motion/react";

const NODES = [
  { id: "sp",        label: "São Paulo",  cx: 148, cy: 282, primary: true },
  { id: "miami",     label: "Miami",      cx: 158, cy: 182 },
  { id: "london",    label: "Londres",    cx: 295, cy: 105 },
  { id: "dubai",     label: "Dubai",      cx: 408, cy: 162 },
  { id: "shanghai",  label: "Shanghai",   cx: 494, cy: 138 },
  { id: "singapore", label: "Singapura",  cx: 482, cy: 228 },
];

// Cubic bezier paths from São Paulo to each destination
const ROUTES = [
  { id: "sp-miami",     d: "M148,282 C120,210 130,182 158,182",     delay: 0.3 },
  { id: "sp-london",    d: "M148,282 C160,80  280,70  295,105",     delay: 0.6 },
  { id: "sp-dubai",     d: "M148,282 C200,50  390,50  408,162",     delay: 0.9 },
  { id: "sp-shanghai",  d: "M148,282 C240,20  480,20  494,138",     delay: 1.2 },
  { id: "sp-singapore", d: "M148,282 C260,30  490,30  482,228",     delay: 1.5 },
];

// Faint continent blobs as simple ellipses/paths for context
const LANDMASSES = [
  // South America
  { id: "sa", d: "M120,220 C115,240 118,300 140,320 C155,335 170,320 168,295 C165,265 155,240 148,225 Z", opacity: 0.08 },
  // North America
  { id: "na", d: "M100,120 C95,140 100,175 130,195 C150,200 165,185 168,165 C170,140 155,115 140,110 Z", opacity: 0.08 },
  // Europe
  { id: "eu", d: "M270,80 C265,90 270,115 285,120 C300,122 315,110 312,92 C308,75 292,70 270,80 Z", opacity: 0.08 },
  // Africa
  { id: "af", d: "M265,140 C260,165 262,210 280,230 C295,245 310,235 312,210 C315,185 308,155 295,140 Z", opacity: 0.06 },
  // Middle East / Asia west
  { id: "me", d: "M370,130 C365,145 368,175 388,185 C405,190 420,178 418,158 C415,138 398,125 370,130 Z", opacity: 0.08 },
  // East Asia
  { id: "ea", d: "M460,100 C455,118 458,155 478,165 C495,170 512,158 510,135 C508,112 490,98 460,100 Z", opacity: 0.08 },
  // Southeast Asia
  { id: "sea", d: "M458,195 C454,210 456,240 474,248 C488,254 500,242 498,222 C496,202 480,192 458,195 Z", opacity: 0.06 },
];

export function RouteMap() {
  return (
    <div className="relative w-full h-full select-none pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 620 380"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dot grid background */}
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.12)" />
          </pattern>
          {/* Glow filter for São Paulo node */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="620" height="380" fill="url(#dots)" />

        {/* Continent blobs */}
        {LANDMASSES.map((l) => (
          <path key={l.id} d={l.d} fill={`rgba(255,255,255,${l.opacity})`} />
        ))}

        {/* Route paths — draw-in animation */}
        {ROUTES.map((route) => (
          <motion.path
            key={route.id}
            d={route.d}
            stroke="rgba(46,124,168,0.7)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: route.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Moving dot along each route */}
        {ROUTES.map((route) => (
          <motion.circle
            key={`dot-${route.id}`}
            r={3}
            fill="#E8B33C"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3,
              delay: route.delay + 1.8,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
            style={{ offsetPath: `path("${route.d}")` } as React.CSSProperties}
          />
        ))}

        {/* Destination nodes */}
        {NODES.filter((n) => !n.primary).map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: ROUTES[i]?.delay + 1.8 || 2 }}
          >
            <circle cx={node.cx} cy={node.cy} r={4} fill="rgba(46,124,168,0.9)" />
            <circle cx={node.cx} cy={node.cy} r={8} fill="rgba(46,124,168,0.15)" />
            <text
              x={node.cx}
              y={node.cy - 12}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(255,255,255,0.6)"
              fontFamily="IBM Plex Mono, monospace"
            >
              {node.label}
            </text>
          </motion.g>
        ))}

        {/* São Paulo — primary origin node */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          filter="url(#glow)"
        >
          {/* Outer pulse ring */}
          <motion.circle
            cx={NODES[0].cx}
            cy={NODES[0].cy}
            r={14}
            fill="none"
            stroke="#E8B33C"
            strokeWidth="1"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <circle cx={NODES[0].cx} cy={NODES[0].cy} r={6} fill="#E8B33C" />
          <circle cx={NODES[0].cx} cy={NODES[0].cy} r={10} fill="rgba(232,179,60,0.25)" />
          <text
            x={NODES[0].cx}
            y={NODES[0].cy - 15}
            textAnchor="middle"
            fontSize="9"
            fill="#E8B33C"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="500"
          >
            São Paulo
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
