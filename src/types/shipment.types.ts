export type ShipmentStatus =
  | "in_transit"
  | "delayed"
  | "exception"
  | "delivered";

export type Shipment = {
  id: string;
  from: string;
  to: string;
  carrier: string;
  status: ShipmentStatus;
  progress: number;
  speed: number;
  eta: string; // ISO date "2026-11-12"
};
