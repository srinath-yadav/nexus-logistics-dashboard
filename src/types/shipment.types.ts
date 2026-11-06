export type ShipmentStatus =
  | "in_transit"
  | "delayed"
  | "exception"
  | "delivered";

export type Shipment = {
  id: string; // "NX-24817"
  from: string; // hub code, e.g. "MAA"
  to: string; // hub code
  carrier: string;
  status: ShipmentStatus;
  progress: number; // 0 → 1 along the route (used in Step 10)
  speed: number; // progress per second, for the demo animation (Step 10)
};
