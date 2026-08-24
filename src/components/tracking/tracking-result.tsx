"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { ManifestRail } from "@/components/tracking/manifest-rail";
import { FollowByEmail } from "@/components/tracking/follow-by-email";
import { useSavedCodes } from "@/components/tracking/saved-numbers";
import {
  RAIL_STAGES,
  isExceptionStatus,
  type PublicShipment,
  type PublicShipmentResult,
  type ShipmentStatus,
  type RailStatus,
} from "@/types/database";
import { normaliseTrackingCode } from "@/lib/tracking-code";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

interface Props {
  shipment: PublicShipment;
  code: string;
  lang: Locale;
  dict: Dictionary;
}

export function TrackingResult({ shipment: initial, code, lang, dict }: Props) {
  const [shipment, setShipment] = useState<PublicShipment>(initial);
  const { save } = useSavedCodes();

  // Save this code to recent list on first render
  useEffect(() => {
    save(initial.tracking_code);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.tracking_code]);

  // Poll every 30s via the security-definer RPC
  useEffect(() => {
    const supabase = createBrowserClient();
    const interval = setInterval(async () => {
      const { data } = await supabase.rpc("get_shipment_by_code", {
        p_code: normaliseTrackingCode(code),
      });
      if (data) {
        const result = data as unknown as PublicShipmentResult;
        if (result.found) {
          setShipment(result as PublicShipment);
        }
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [code]);

  const { status, events, origin_city, origin_country, destination_city, destination_country, pieces, tracking_code } = shipment;
  const latestEvent = events[events.length - 1];
  const isException = isExceptionStatus(status);
  const locale = lang === "pt" ? "pt-BR" : "en-GB";

  // Build rail labels from dict
  const railLabels = Object.fromEntries(
    RAIL_STAGES.map((s) => [s, dict.status[s as keyof typeof dict.status]])
  ) as Record<RailStatus, string>;

  // Build timestamps map for the rail
  const railTimestamps: Partial<Record<RailStatus, string>> = {};
  for (const event of events) {
    if (RAIL_STAGES.includes(event.status as RailStatus)) {
      railTimestamps[event.status as RailStatus] = new Date(event.happened_at).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
      });
    }
  }

  // Plain-language status line
  const stageLabel = dict.status[status as keyof typeof dict.status];
  const nextIndex = RAIL_STAGES.indexOf(status as RailStatus) + 1;
  const nextStage = !isException && nextIndex < RAIL_STAGES.length
    ? dict.status[RAIL_STAGES[nextIndex] as keyof typeof dict.status]
    : null;

  const eventDate = latestEvent
    ? new Date(latestEvent.happened_at).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Freshness marker
  let freshnessText = "";
  if (latestEvent) {
    const diffMs = Date.now() - new Date(latestEvent.happened_at).getTime();
    const diffH = Math.floor(diffMs / 3_600_000);
    const diffD = Math.floor(diffH / 24);
    if (diffH < 24) {
      freshnessText = dict.tracking.freshness.replace("{n}", String(diffH || 1));
    } else {
      freshnessText = dict.tracking.freshnessDay.replace("{n}", String(diffD));
    }
  }

  return (
    <div className="space-y-6">
      {/* Exception banner */}
      {isException && (
        <div className="rounded-lg border border-signal/30 bg-[#FBF3E0] px-5 py-4">
          <p className="font-medium text-[#7A5A16]">
            {dict.status[status as keyof typeof dict.status]}
          </p>
          <p className="text-sm text-[#7A5A16]/80 mt-1">
            {dict.tracking.exceptionBannerBody}
          </p>
        </div>
      )}

      {/* Plain-language status lead */}
      <div className="bg-surface rounded-lg border border-border p-5 md:p-6">
        <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-2">
          {freshnessText}
        </p>
        <h2 className="font-display text-2xl font-semibold text-deep leading-tight">
          {dict.tracking.statusLeadHeadline
            .replace("{stage}", stageLabel)
            .replace("{destination}", `${destination_city}`)}
        </h2>
        {eventDate && latestEvent && (
          <p className="text-sm text-steel mt-2">
            {nextStage && status !== "delivered"
              ? dict.tracking.statusLeadBody
                  .replace("{event}", dict.status[latestEvent.status as keyof typeof dict.status])
                  .replace("{date}", eventDate)
                  .replace("{nextStage}", nextStage)
              : dict.tracking.statusLeadBodyDelivered
                  .replace("{event}", dict.status[latestEvent.status as keyof typeof dict.status])
                  .replace("{date}", eventDate)}
          </p>
        )}
      </div>

      {/* Shipment header */}
      <div className="bg-surface rounded-lg border border-border p-5 md:p-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
          <h3 className="font-mono text-sm text-steel">
            {dict.tracking.shipmentHeading.replace("{number}", tracking_code)}
          </h3>
          <span className="text-sm text-steel">
            {dict.tracking.routeLine
              .replace("{originCity}", origin_city)
              .replace("{originCountry}", origin_country)
              .replace("{destCity}", destination_city)
              .replace("{destCountry}", destination_country)}
          </span>
          <span className="text-sm text-steel">
            {dict.tracking.pieces.replace("{n}", String(pieces))}
          </span>
        </div>

        {/* Manifest rail — full variant */}
        <ManifestRail
          status={status}
          labels={railLabels}
          timestamps={railTimestamps}
          variant="full"
        />
      </div>

      {/* Event history */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="grid grid-cols-[140px_1fr_1fr] gap-4">
            <span className="font-mono text-[11px] tracking-widest text-steel uppercase">
              {dict.tracking.eventsDateHeader}
            </span>
            <span className="font-mono text-[11px] tracking-widest text-steel uppercase">
              {dict.tracking.eventsStageHeader}
            </span>
            <span className="font-mono text-[11px] tracking-widest text-steel uppercase">
              {dict.tracking.eventsLocationHeader}
            </span>
          </div>
        </div>
        {events.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-steel">—</div>
        ) : (
          <div className="divide-y divide-border">
            {[...events].reverse().map((event, i) => (
              <div
                key={i}
                className="px-5 py-4 grid grid-cols-[140px_1fr_1fr] gap-4 items-start"
              >
                <time
                  dateTime={event.happened_at}
                  className="font-mono text-xs text-steel"
                >
                  {new Date(event.happened_at).toLocaleString(locale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                <div>
                  <span className="text-sm text-ink">
                    {dict.status[event.status as keyof typeof dict.status]}
                  </span>
                  {event.note && (
                    <p className="text-xs text-steel mt-0.5">{event.note}</p>
                  )}
                </div>
                <span className="text-sm text-steel">{event.location ?? "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Follow by email */}
      <div className="bg-surface rounded-lg border border-border p-5 md:p-6">
        <FollowByEmail trackingCode={tracking_code} lang={lang} />
      </div>

      {/* Privacy note */}
      <p className="text-xs text-steel text-center">{dict.tracking.privacyNote}</p>
    </div>
  );
}
