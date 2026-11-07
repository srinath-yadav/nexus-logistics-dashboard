import type { Shipment } from "../types/shipment.types";

export type StepState = "done" | "current" | "warning" | "problem" | "upcoming";
export type TimelineStep = { label: string; state: StepState };

/** Turns a shipment into the 5 steps of its journey, marking where it is now. */
export function buildTimeline(
  shipment: Shipment,
  fromCity: string,
  toCity: string,
): TimelineStep[] {
  const labels = [
    `Picked up in ${fromCity}`,
    `Departed ${fromCity}`,
    `In transit to ${toCity}`,
    `Arrived in ${toCity}`,
    "Delivered",
  ];

  // Which step is happening right now?
  let current: number;
  if (shipment.status === "delivered")
    current = labels.length; // all done
  else if (shipment.progress >= 1)
    current = 3; // arrived, not yet delivered
  else if (shipment.progress > 0)
    current = 2; // on the way
  else current = 1; // waiting to depart

  // The current step takes the shipment's mood
  const currentState: StepState =
    shipment.status === "exception" ? "problem"
    : shipment.status === "delayed" ? "warning"
    : "current";

  return labels.map((label, i) => ({
    label,
    state:
      i < current ? "done"
      : i === current ? currentState
      : "upcoming",
  }));
}
