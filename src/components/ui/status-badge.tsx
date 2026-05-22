import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types/database";

const statusColors: Record<ShipmentStatus, string> = {
  registered: "bg-pine/10 text-pine border-pine/20",
  documentation: "bg-pine/10 text-pine border-pine/20",
  awaiting_departure: "bg-honey/10 text-honey border-honey/20",
  in_transit: "bg-pine/10 text-pine border-pine/20",
  border_crossing: "bg-sky/10 text-sky border-sky/20",
  arrival_hub: "bg-sky/10 text-sky border-sky/20",
  out_for_delivery: "bg-honey/10 text-honey border-honey/20",
  delivered: "bg-sky/10 text-sky border-sky/20",
  on_hold: "bg-honey/10 text-honey border-honey/20",
  delayed: "bg-[#C0563E]/10 text-[#C0563E] border-[#C0563E]/20",
};

const statusLabels: Record<ShipmentStatus, string> = {
  registered: "Registered",
  documentation: "Documentation",
  awaiting_departure: "Awaiting Departure",
  in_transit: "In Transit",
  border_crossing: "Border Crossing",
  arrival_hub: "Arrival Hub",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  on_hold: "On Hold",
  delayed: "Delayed",
};

interface StatusBadgeProps {
  status: ShipmentStatus;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusColors[status],
        className
      )}
    >
      {label || statusLabels[status]}
    </span>
  );
}
