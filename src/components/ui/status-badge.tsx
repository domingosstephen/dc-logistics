import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/types/database";

interface StatusBadgeProps {
  status: ShipmentStatus;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-mono border",
        "bg-muted text-steel border-border",
        className
      )}
    >
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
