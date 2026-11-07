import type { QuadraticBezierCurve3, Vector3 } from "three";
import { HUBS_BY_CODE } from "../data/hubs";
import { arcCurve, latLonToVector3 } from "../lib/geo";
import type { Shipment } from "../types/shipment.types";

const ROUTE_HEIGHT = 1.015;

export type Route = {
  shipment: Shipment;
  curve: QuadraticBezierCurve3;
  points: Vector3[];
};

/** One shipment → its curved route, or null if a hub code is unknown. */
export function buildRoute(shipment: Shipment): Route | null {
  const from = HUBS_BY_CODE[shipment.from];
  const to = HUBS_BY_CODE[shipment.to];
  if (!from || !to) return null;
  const curve = arcCurve(
    latLonToVector3(from.lat, from.lon, ROUTE_HEIGHT),
    latLonToVector3(to.lat, to.lon, ROUTE_HEIGHT),
  );
  return { shipment, curve, points: curve.getPoints(64) };
}

/** Routes for the globe: active shipments only. */
export function buildRoutes(shipments: Shipment[]): Route[] {
  return shipments
    .filter((shipment) => shipment.status !== "delivered")
    .flatMap((shipment) => {
      const route = buildRoute(shipment);
      return route ? [route] : [];
    });
}
