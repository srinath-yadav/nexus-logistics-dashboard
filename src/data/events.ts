import type { NexusEvent } from "../types/event.types";

export const EVENTS: NexusEvent[] = [
  {
    id: "ev-1",
    time: "14:31",
    shipmentId: "NX-24817",
    text: "Departed Chennai hub → Singapore",
    level: "info",
  },
  {
    id: "ev-2",
    time: "14:26",
    shipmentId: "NX-24790",
    text: "Customs hold at Dubai, +6h",
    level: "warning",
  },
  {
    id: "ev-3",
    time: "14:18",
    shipmentId: "NX-24755",
    text: "Delivered in Rotterdam",
    level: "success",
  },
  {
    id: "ev-4",
    time: "14:09",
    shipmentId: "NX-24702",
    text: "Temperature alert, reefer unit 4",
    level: "critical",
  },
  {
    id: "ev-5",
    time: "13:58",
    shipmentId: "NX-24688",
    text: "Arrived Mumbai hub",
    level: "info",
  },
  {
    id: "ev-6",
    time: "13:44",
    shipmentId: "NX-24650",
    text: "Rerouted via Hamburg",
    level: "warning",
  },
  {
    id: "ev-7",
    time: "13:31",
    shipmentId: "NX-24611",
    text: "Departed Los Angeles → Shanghai",
    level: "info",
  },
  {
    id: "ev-8",
    time: "13:12",
    shipmentId: "NX-24598",
    text: "Cleared customs in Dubai",
    level: "success",
  },
];
