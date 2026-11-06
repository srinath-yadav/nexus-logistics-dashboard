// How serious an event is — drives its colour
export type EventLevel = "info" | "success" | "warning" | "critical";

export type NexusEvent = {
  id: string; // unique id for React keys, e.g. "ev-1"
  time: string; // "14:31" (becomes a real timestamp with the store)
  shipmentId: string; // "NX-24817" — links to /shipments/NX-24817
  text: string; // "Departed Chennai hub → Singapore"
  level: EventLevel;
};
