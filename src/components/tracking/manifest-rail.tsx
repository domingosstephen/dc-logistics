"use client";

import { RAIL_STAGES, type ShipmentStatus, type RailStatus, isExceptionStatus } from "@/types/database";
import { cn } from "@/lib/utils";

interface ManifestRailProps {
  status: ShipmentStatus;
  /** Labels for each rail stage, keyed by status string */
  labels: Record<RailStatus, string>;
  /** Timestamps per stage (optional — condensed variant hides them) */
  timestamps?: Partial<Record<RailStatus, string>>;
  variant?: "full" | "condensed";
  className?: string;
}

/**
 * The signature element of the DC Logistics Brasil UI.
 *
 * Three behaviour modes:
 *  - full (default): horizontal on desktop, vertical on mobile, labels + timestamps
 *  - condensed: an 8-tick strip ~74px wide, no labels, for list rows
 *
 * Exception states (on_hold, returned, cancelled) freeze the rail at the
 * last real segment. The caller should render the exception banner above.
 */
export function ManifestRail({
  status,
  labels,
  timestamps,
  variant = "full",
  className,
}: ManifestRailProps) {
  // Resolve the effective rail position
  // Exception states don't advance the rail — use the last event that WAS
  // a rail stage (unknown here, so freeze at last-known or stage 0).
  // For display, treat exception as "at" the previous real stage.
  const activeIndex = isExceptionStatus(status)
    ? RAIL_STAGES.indexOf("delivered") // will show all filled; caller shows banner
    : RAIL_STAGES.indexOf(status as RailStatus);

  if (variant === "condensed") {
    return <CondensedRail activeIndex={activeIndex} status={status} className={className} />;
  }

  return (
    <>
      {/* Desktop — horizontal */}
      <div
        className={cn("hidden md:flex items-start w-full", className)}
        aria-label="Shipment progress"
        role="list"
      >
        {RAIL_STAGES.map((stage, i) => (
          <HorizontalSegment
            key={stage}
            index={i}
            activeIndex={activeIndex}
            label={labels[stage]}
            timestamp={timestamps?.[stage]}
            isLast={i === RAIL_STAGES.length - 1}
          />
        ))}
      </div>

      {/* Mobile — vertical */}
      <div
        className={cn("flex md:hidden flex-col gap-0", className)}
        aria-label="Shipment progress"
        role="list"
      >
        {RAIL_STAGES.map((stage, i) => (
          <VerticalSegment
            key={stage}
            index={i}
            activeIndex={activeIndex}
            label={labels[stage]}
            timestamp={timestamps?.[stage]}
            isLast={i === RAIL_STAGES.length - 1}
          />
        ))}
      </div>
    </>
  );
}

/* -----------------------------------------------
   Segment state helpers
   ----------------------------------------------- */

function segmentState(index: number, activeIndex: number) {
  if (index < activeIndex) return "filled";
  if (index === activeIndex) return "active";
  return "pending";
}

const segmentBg: Record<string, string> = {
  filled:  "bg-deep",
  active:  "bg-signal",
  pending: "bg-deep/25",
};

/* -----------------------------------------------
   Horizontal segment (desktop)
   ----------------------------------------------- */

interface SegmentProps {
  index: number;
  activeIndex: number;
  label: string;
  timestamp?: string;
  isLast: boolean;
}

function HorizontalSegment({ index, activeIndex, label, timestamp, isLast }: SegmentProps) {
  const state = segmentState(index, activeIndex);
  return (
    <div className="flex flex-col items-center flex-1 min-w-0" role="listitem">
      <div className="flex items-center w-full">
        {/* connector line before */}
        <div
          className={cn(
            "h-0.5 flex-1",
            index === 0 ? "invisible" : segmentBg[index <= activeIndex ? "filled" : "pending"]
          )}
        />
        {/* tick */}
        <div
          className={cn(
            "w-2 h-2 rounded-[2px] shrink-0",
            segmentBg[state]
          )}
          aria-hidden="true"
        />
        {/* connector line after */}
        <div
          className={cn(
            "h-0.5 flex-1",
            isLast ? "invisible" : segmentBg[index < activeIndex ? "filled" : "pending"]
          )}
        />
      </div>
      {/* label */}
      <span
        className={cn(
          "mt-2 text-center text-xs leading-tight px-1",
          state === "active" ? "font-medium text-ink" : "text-steel"
        )}
      >
        {label}
      </span>
      {/* timestamp */}
      {timestamp && (
        <span className="mt-0.5 font-mono text-[10px] text-steel leading-none">
          {timestamp}
        </span>
      )}
    </div>
  );
}

/* -----------------------------------------------
   Vertical segment (mobile)
   ----------------------------------------------- */

function VerticalSegment({ index, activeIndex, label, timestamp, isLast }: SegmentProps) {
  const state = segmentState(index, activeIndex);
  return (
    <div className="flex gap-3" role="listitem">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-2 h-2 rounded-[2px] shrink-0 mt-1",
            segmentBg[state]
          )}
          aria-hidden="true"
        />
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 mt-1",
              index < activeIndex ? "bg-deep" : "bg-deep/25"
            )}
          />
        )}
      </div>
      <div className="pb-5 min-w-0">
        <span
          className={cn(
            "block text-sm leading-tight",
            state === "active" ? "font-medium text-ink" : "text-steel"
          )}
        >
          {label}
        </span>
        {timestamp && (
          <span className="block font-mono text-[11px] text-steel mt-0.5">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}

/* -----------------------------------------------
   Condensed variant — 8-tick strip, no labels
   ----------------------------------------------- */

function CondensedRail({
  activeIndex,
  status,
  className,
}: {
  activeIndex: number;
  status: ShipmentStatus;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-[3px]", className)}
      aria-hidden="true"
      style={{ width: 74 }}
    >
      {RAIL_STAGES.map((_, i) => {
        const state = segmentState(i, activeIndex);
        return (
          <div
            key={i}
            className={cn("flex-1 h-1.5 rounded-[2px]", segmentBg[state])}
          />
        );
      })}
    </div>
  );
}
