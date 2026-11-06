
import type { ShipmentStatus } from "../types/shipment.types";

// Industry-standard status colours (keep in sync with @theme in index.css)
export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  in_transit: "#38bdf8", // blue  — moving normally
  delivered: "#4ade80", // green — completed
  delayed: "#fbbf24", // amber — at risk
  exception: "#f87171", // red   — needs action
};
