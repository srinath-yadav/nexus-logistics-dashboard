import { HUBS_BY_CODE } from "../src/data/hubs";
import type { Shipment, ShipmentStatus } from "../src/types/shipment.types";

const STATUSES: ShipmentStatus[] = [
  "in_transit",
  "delayed",
  "exception",
  "delivered",
];
const ID_PATTERN = /^NX-\d{5}$/; // NX- followed by 5 digits
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // 2026-11-12
const CARRIER_PATTERN = /^[A-Za-z0-9 .&-]{1,40}$/; // letters, digits, a few symbols, max 40

type Result = { ok: true; shipment: Shipment } | { ok: false; error: string };

const fail = (field: string): Result => ({
  ok: false,
  error: `Invalid or missing field: ${field}`,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Checks untrusted input and returns a clean Shipment, or an error message. */
export function validateShipment(input: unknown): Result {
  if (!isRecord(input))
    return { ok: false, error: "shipment must be an object" };

  const { id, from, to, carrier, status, progress, speed, eta } = input;

  if (typeof id !== "string" || !ID_PATTERN.test(id)) return fail("id");
  if (typeof from !== "string" || !HUBS_BY_CODE[from]) return fail("from");
  if (typeof to !== "string" || !HUBS_BY_CODE[to] || to === from)
    return fail("to");
  if (typeof carrier !== "string" || !CARRIER_PATTERN.test(carrier))
    return fail("carrier");
  if (
    typeof status !== "string" ||
    !STATUSES.includes(status as ShipmentStatus)
  )
    return fail("status");
  if (
    typeof progress !== "number" ||
    !Number.isFinite(progress) ||
    progress < 0 ||
    progress > 1
  )
    return fail("progress");
  if (typeof speed !== "number" || !Number.isFinite(speed) || speed < 0)
    return fail("speed");
  if (
    typeof eta !== "string" ||
    !DATE_PATTERN.test(eta) ||
    Number.isNaN(Date.parse(eta))
  )
    return fail("eta");

  // Rebuild with ONLY the known fields: anything extra the caller sent is dropped
  return {
    ok: true,
    shipment: {
      id,
      from,
      to,
      carrier,
      status: status as ShipmentStatus,
      progress,
      speed,
      eta,
    },
  };
}
