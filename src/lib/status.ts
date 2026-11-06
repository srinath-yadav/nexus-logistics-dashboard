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
