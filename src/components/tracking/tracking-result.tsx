"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createBrowserClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PublicShipment, PublicShipmentEvent, ShipmentStatus } from "@/types/database";

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

const statusMessages: Record<ShipmentStatus, (name: string) => string> = {
  registered: (n) => `${n} e stato registrato nel nostro sistema. Ci prendiamo cura di tutto.`,
  documentation: (n) => `Stiamo preparando tutti i documenti e i controlli veterinari per ${n}.`,
  awaiting_departure: (n) => `${n} e pronto e comodo nel trasportino. Pronti a partire!`,
  in_transit: (n) => `${n} e in viaggio! Tutto procede bene.`,
  border_crossing: (n) => `Controllo del passaporto EU per ${n}. Procedura di routine.`,
  arrival_hub: (n) => `${n} e arrivato all'hub di destinazione e si sta riposando.`,
  out_for_delivery: (n) => `${n} e nell'ultima tappa del viaggio verso la famiglia!`,
  delivered: (n) => `${n} e stato riunito con la famiglia! Buon viaggio completato.`,
  on_hold: (n) => `${n} sta riposando al sicuro. Abbiamo messo in pausa il viaggio per il suo comfort.`,
  delayed: (n) => `C'e un piccolo ritardo per ${n}. Non preoccuparti, e al sicuro e accudito.`,
};

interface Props {
  shipment: PublicShipment;
  code: string;
}

export function TrackingResult({ shipment: initial, code }: Props) {
  const [events, setEvents] = useState<PublicShipmentEvent[]>(initial.events);
  const [currentStatus, setCurrentStatus] = useState(initial.status);

  // Realtime subscription
  useEffect(() => {
    const supabase = createBrowserClient();

    const channel = supabase
      .channel(`tracking-${code}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shipment_events",
        },
        (payload) => {
          const newEvent = payload.new as {
            status: ShipmentStatus;
            location: string | null;
            note: string | null;
            happened_at: string;
          };
          setEvents((prev) => [...prev, newEvent]);
          setCurrentStatus(newEvent.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
              <StatusBadge status={currentStatus} />
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
                Consegna stimata: {new Date(initial.estimated_delivery).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {/* Reassuring message */}
        <div className="mt-5 p-4 rounded-xl bg-pine/5 border border-pine/10">
          <p className="text-sm text-pine leading-relaxed">
            {statusMessages[currentStatus](initial.pet_name)}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            Cronologia del Viaggio
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-pine bg-pine/5 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-pine animate-pulse" />
            Aggiornamenti in tempo reale
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
                    <StatusBadge status={event.status} />
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
                    {new Date(event.happened_at).toLocaleDateString("it-IT", {
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
