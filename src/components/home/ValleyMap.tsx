import { useMemo } from "react";

import { schools } from "@/lib/data";
import { band } from "@/lib/scoring";
import type { Band } from "@/lib/types";
import { cn } from "@/lib/utils";

const VB_W = 1000;
const VB_H = 600;
const CX = 500;
const CY = 310;

/** FNV-1a hash → [0, 1). Deterministic, so the layout never reshuffles. */
function hash01(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/**
 * A rough city for the few schools whose name carries one. Used only to nudge
 * those points toward the right side of the valley.
 */
function cityOf(name: string): "ktm" | "lal" | null {
  if (/lalitpur|jawlakhel/i.test(name)) return "lal";
  if (/maitighar|bagbazar|kathmandu/i.test(name)) return "ktm";
  return null;
}

const CITY_ANCHORS = {
  ktm: { x: 470, y: 285 },
  lal: { x: 505, y: 405 },
} as const;

type Point = { x: number; y: number; band: Band; label: string };

/**
 * A stylised map of the Kathmandu Valley with the 43 schools as points.
 *
 * The schools carry no coordinates — every row says "Kathmandu Valley" — so the
 * positions are a deliberate fiction: a golden-angle (sunflower) spiral ordered
 * by rank, nudged toward Kathmandu or Lalitpur for the handful of names that
 * carry a city, then finished with a deterministic hash jitter. The result is
 * *about* the data (43 points, band-coloured, on a valley floor) without
 * pretending to be a survey of where each campus actually stands.
 *
 * The map is layered for depth rather than flat: the bowl carries a radial
 * gradient, a warm glow breathes at its centre, contour rings swell and settle,
 * pulse rings expand outward, and the river runs a dashed flow. Every point
 * wears a dim halo so the field reads as a scattering of lights. All of it is
 * transform/opacity (or `stroke-dashoffset`), so it stays on the compositor.
 *
 * Decorative: the real roster is always adjacent in text, so the SVG is
 * `aria-hidden`.
 */
export function ValleyMap({ className }: { className?: string }) {
  const points = useMemo<Point[]>(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const maxR = 300;
    return schools.map((school, i) => {
      const r = maxR * Math.sqrt((i + 0.5) / schools.length);
      const theta = i * golden;
      let x = CX + r * Math.cos(theta);
      let y = CY + r * Math.sin(theta) * 0.62;

      const city = cityOf(school.name);
      if (city) {
        const anchor = CITY_ANCHORS[city];
        const t = 0.55;
        x = x * (1 - t) + anchor.x * t;
        y = y * (1 - t) + anchor.y * t;
      }

      // A small deterministic jitter, so the spiral reads as a scatter rather
      // than a pattern a reader could mistake for real geography.
      const jitter = 26;
      x += (hash01(school.name) - 0.5) * jitter;
      y += (hash01(`${school.name}:y`) - 0.5) * jitter;

      return { x, y, band: band(school.overallScore), label: school.name };
    });
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn("animate-map-drift", className)}
    >
      <defs>
        {/* The bowl: bright at the centre, fading into the dark canvas so the
            valley reads as a depression rather than a flat disc. */}
        <radialGradient id="valley-bowl" cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="var(--color-surface)" stopOpacity="0.95" />
          <stop offset="70%" stopColor="var(--color-surface)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-canvas)" stopOpacity="0" />
        </radialGradient>

        {/* The warm glow that breathes at the valley's centre. */}
        <radialGradient id="valley-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-bronze)" stopOpacity="0.55" />
          <stop offset="60%" stopColor="var(--color-bronze)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-bronze)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The valley bowl. */}
      <ellipse cx={CX} cy={CY} rx={480} ry={305} fill="url(#valley-bowl)" />

      {/* Centre glow, breathing. */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={330}
        ry={210}
        fill="url(#valley-glow)"
        className="animate-map-breathe"
      />

      {/* Contour rings: the hills that close the bowl. */}
      {[455, 480, 505].map((rx, i) => (
        <ellipse
          key={rx}
          cx={CX}
          cy={CY}
          rx={rx}
          ry={275 + i * 28}
          fill="none"
          stroke="var(--color-ink-inverse)"
          strokeOpacity={0.16 - i * 0.03}
          strokeWidth={1}
        />
      ))}

      {/* Two rings that swell and settle on a slow cycle, out of phase. */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={430}
        ry={268}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeWidth={1}
        className="animate-map-ring"
      />
      <ellipse
        cx={CX}
        cy={CY}
        rx={455}
        ry={282}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeWidth={1}
        className="animate-map-ring"
        style={{ animationDelay: "-8s" }}
      />

      {/* The Bagmati, running north to south through the valley. */}
      <path
        d={`M ${CX - 40} ${CY - 250} C ${CX - 90} ${CY - 90}, ${CX + 70} ${CY + 60}, ${CX - 10} ${CY + 250}`}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeOpacity={0.28}
        strokeWidth={1.5}
      />
      {/* A dashed flow line riding the same course. */}
      <path
        d={`M ${CX - 40} ${CY - 250} C ${CX - 90} ${CY - 90}, ${CX + 70} ${CY + 60}, ${CX - 10} ${CY + 250}`}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeOpacity={0.16}
        strokeWidth={1.5}
        strokeDasharray="2 12"
        className="animate-map-flow"
      />

      {/* The three cities of the valley. */}
      <CityLabel x={470} y={285} label="Kathmandu" />
      <CityLabel x={505} y={405} label="Lalitpur" />
      <CityLabel x={660} y={300} label="Bhaktapur" />

      {/* Pulse rings expanding outward from the valley's centre. Staggered so
          there is always one travelling while another is gone. */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={140}
          fill="none"
          stroke="var(--color-bronze)"
          strokeWidth={1}
          className="animate-map-pulse-expand"
          style={{ animationDelay: `${i * 1.7}s` }}
        />
      ))}

      {/* The 43 schools, band-coloured, each with a breathing halo. */}
      {points.map((point) => (
        <g key={point.label}>
          <circle
            cx={point.x}
            cy={point.y}
            r={10}
            fill={`var(--color-band-${point.band})`}
            className="animate-map-halo"
            style={{ animationDelay: `${Math.round(hash01(`${point.label}:h`) * 3200)}ms` }}
          />
          <circle
            cx={point.x}
            cy={point.y}
            r={4.5}
            fill={`var(--color-band-${point.band})`}
            className="animate-map-point"
            style={{ animationDelay: `${Math.round(hash01(point.label) * 3200)}ms` }}
          />
        </g>
      ))}
    </svg>
  );
}

function CityLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y} r={3} fill="var(--color-ink-inverse)" fillOpacity={0.5} />
      <text
        x={x + 10}
        y={y + 4}
        fill="var(--color-ink-inverse)"
        fillOpacity={0.45}
        style={{
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </text>
    </g>
  );
}
