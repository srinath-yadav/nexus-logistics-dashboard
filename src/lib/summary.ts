import type { Hub } from "../types/hub.types";
import type { Shipment } from "../types/shipment.types";
import { isHighLoad } from "./hubLoad";

export type SummaryTone = "good" | "watch" | "action";

export type ShipmentSummary = {
  headline: string; // "Running late."
  detail: string; // the rest of the sentence(s)
  tone: SummaryTone;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const kmFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/**
 * A short plain-English summary of a shipment.
 * `today` is a parameter (not read inside) so tests can fix the date.
 */
export function summarizeShipment(
  shipment: Shipment,
  from: Hub,
  to: Hub,
  remainingKm: number,
  today: Date = new Date(),
): ShipmentSummary {
  const percent = Math.round(shipment.progress * 100);
  const eta = new Date(shipment.eta);
  const etaText = dateFormatter.format(eta);
  const km = kmFormatter.format(remainingKm);
  const daysLeft = Math.ceil((eta.getTime() - today.getTime()) / DAY_MS);

  // Extra warning if the destination hub is congested
  const congestion =
    isHighLoad(to) ?
      ` ${to.city} hub is at ${Math.round(to.capacityUsed * 100)}% capacity, so unloading may be slow.`
    : "";

  switch (shipment.status) {
    case "delivered":
      return {
        headline: "Delivered.",
        detail: `Arrived in ${to.city} from ${from.city}. No action needed.`,
        tone: "good",
      };

    case "exception":
      return {
        headline: "Needs action.",
        detail: `Stopped ${percent}% of the way to ${to.city}, ${km} km short. The ${etaText} ETA is at risk until the issue is resolved.${congestion}`,
        tone: "action",
      };

    case "delayed":
      return {
        headline: "Running late.",
        detail: `${percent}% of the way to ${to.city}, about ${km} km to go. Expected ${etaText}.${congestion}`,
        tone: "watch",
      };

    case "in_transit":
      if (daysLeft < 0) {
        return {
          headline: "Past its ETA.",
          detail: `Was due ${etaText} but is still ${km} km from ${to.city}. Check with ${shipment.carrier}.`,
          tone: "action",
        };
      }
      return {
        headline: "On track.",
        detail: `${percent}% of the way to ${to.city}, ${km} km to go. Arriving ${
          daysLeft === 0 ? "today"
          : daysLeft === 1 ? "tomorrow"
          : `in ${daysLeft} days`
        } (${etaText}).${congestion}`,
        tone: congestion ? "watch" : "good",
      };
  }
}

export type SummarySource = "ai" | "rules";

/** What /api/summary returns. */
export type SummaryResponse = ShipmentSummary & { source: SummarySource };