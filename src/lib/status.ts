import type { ShipmentStatus } from "../types/shipment.types";

// Industry-standard status colours (keep in sync with @theme in index.css)
export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  in_transit: "#38bdf8", // blue  — moving normally
  delivered: "#4ade80", // green — completed
  delayed: "#fbbf24", // amber — at risk
  exception: "#f87171", // red   — needs action
};

import type { EventLevel } from "../types/event.types";

// Full Tailwind class strings (never build them like `bg-${x}` — Tailwind can't detect that)
export const EVENT_LEVEL_STYLES: Record<
  EventLevel,
  { bar: string; label: string }
> = {
  info: { bar: "bg-transit", label: "Update" },
  success: { bar: "bg-delivered", label: "Completed" },
  warning: { bar: "bg-delayed", label: "Warning" },
  critical: { bar: "bg-exception", label: "Critical" },
};

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  in_transit: "In transit",
  delayed: "Delayed",
  exception: "Exception",
  delivered: "Delivered",
};

// Full class strings so Tailwind can find them
export const STATUS_CHIP_STYLES: Record<ShipmentStatus, string> = {
  in_transit: "text-transit border-transit/40 bg-transit/10",
  delayed: "text-delayed border-delayed/40 bg-delayed/10",
  exception: "text-exception border-exception/40 bg-exception/10",
  delivered: "text-delivered border-delivered/40 bg-delivered/10",
};

// Progress bar fill per status
export const STATUS_BAR_STYLES: Record<ShipmentStatus, string> = {
  in_transit: "bg-transit",
  delayed: "bg-delayed",
  exception: "bg-exception",
  delivered: "bg-delivered",
};
