"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createBrowserClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PublicShipment, PublicShipmentEvent, ShipmentStatus } from "@/types/database";
import type { Locale, Dictionary } from "@/app/[lang]/dictionaries";

const STATUS_ORDER: ShipmentStatus[] = [
  "registered",
  "documentation",
  "awaiting_departure",
  "in_transit",
  "border_crossing",
  "arrival_hub",
  "out_for_delivery",
  "delivered",
];

interface Props {
  shipment: PublicShipment;
  code: string;
  lang: Locale;
  dict: Dictionary;
}

export function TrackingResult({ shipment: initial, code, lang, dict }: Props) {
  const [events, setEvents] = useState<PublicShipmentEvent[]>(initial.events);
  const [currentStatus, setCurrentStatus] = useState(initial.status);

  // Poll for updates (realtime requires authenticated RLS, so we poll the security-definer RPC)
  useEffect(() => {
    const supabase = createBrowserClient();

    const poll = async () => {
      const { data } = await supabase.rpc("get_shipment_by_code", {
        p_code: code,
      });
      if (data) {
        const updated = data as unknown as PublicShipment;
        setEvents(updated.events);
        setCurrentStatus(updated.status);
      }
    };

    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [code]);

  const currentStepIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="bg-paper rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
      {/* Header */}
      <div className="p-6 md:p-8 bg-mist border-b border-pine/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Pet photo placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-pine/10 flex items-center justify-center shrink-0 overflow-hidden">
            {initial.pet_photo_path ? (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-photos/${initial.pet_photo_path}`}
                alt={initial.pet_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-10 h-10 text-pine/30" fill="none" viewBox="0 0 40 40" stroke="currentColor" strokeWidth={1}>
                <circle cx="12" cy="10" r="4" />
                <circle cx="28" cy="10" r="3.5" />
                <circle cx="7" cy="22" r="3.5" />
                <circle cx="33" cy="22" r="3" />
                <ellipse cx="20" cy="26" rx="8" ry="10" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {initial.pet_name}
              </h2>
              <StatusBadge status={currentStatus} label={dict.status[currentStatus]} />
            </div>
            {initial.pet_breed && (
              <p className="text-sm text-ink/50 mt-0.5">{initial.pet_breed}</p>
            )}
            <p className="text-sm text-ink/60 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
              {initial.origin_city}, {initial.origin_country} → {initial.destination_city}, {initial.destination_country}
            </p>
            {initial.estimated_delivery && (
              <p className="text-xs text-ink/40 mt-1">
                {dict.tracking.estimatedDelivery}: {new Date(initial.estimated_delivery).toLocaleDateString(lang === "de" ? "de-DE" : lang === "es" ? "es-ES" : lang === "en" ? "en-GB" : "it-IT", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            {initial.receiver_name && (
              <p className="text-sm text-ink/60 mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Z" />
                </svg>
                {initial.receiver_name}{initial.receiver_address ? ` — ${initial.receiver_address}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Reassuring message */}
        <div className="mt-5 p-4 rounded-xl bg-pine/5 border border-pine/10">
          <p className="text-sm text-pine leading-relaxed">
            {dict.statusMessages[currentStatus].replace("{petName}", initial.pet_name)}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            {lang === "it" ? "Cronologia del Viaggio" : lang === "de" ? "Reiseverlauf" : lang === "es" ? "Cronologia del Viaje" : "Journey Timeline"}
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-pine bg-pine/5 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-pine animate-pulse" />
            {dict.tracking.liveUpdates}
          </span>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-pine/10" />

          <AnimatePresence mode="popLayout">
            {/* Completed events */}
            {events.map((event, i) => (
              <motion.div
                key={`${event.status}-${event.happened_at}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0">
                  {i === events.length - 1 && currentStatus !== "delivered" ? (
                    // Active dot with pulse
                    <div className="w-[31px] h-[31px] flex items-center justify-center">
                      <div className="absolute w-[31px] h-[31px] rounded-full bg-honey/20 animate-ping" />
                      <div className="w-4 h-4 rounded-full bg-honey border-2 border-paper" />
                    </div>
                  ) : (
                    <div className="w-[31px] h-[31px] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-pine border-2 border-paper" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={event.status} label={dict.status[event.status]} />
                    {event.location && (
                      <span className="text-xs text-ink/40">{event.location}</span>
                    )}
                  </div>
                  {event.note && (
                    <p className="text-sm text-ink/70 mt-1.5 leading-relaxed">
                      {event.note}
                    </p>
                  )}
                  <p className="text-xs text-ink/30 mt-1">
                    {new Date(event.happened_at).toLocaleDateString(lang === "de" ? "de-DE" : lang === "es" ? "es-ES" : lang === "en" ? "en-GB" : "it-IT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Future steps (faded) */}
          {STATUS_ORDER.filter(
            (s) => STATUS_ORDER.indexOf(s) > currentStepIndex && s !== "delivered"
          ).map((futureStatus) => (
            <div
              key={futureStatus}
              className="relative flex gap-4 pb-6 last:pb-0 opacity-30"
            >
              <div className="relative z-10 shrink-0">
                <div className="w-[31px] h-[31px] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-pine/30 bg-paper" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <StatusBadge status={futureStatus} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
