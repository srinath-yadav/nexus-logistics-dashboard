import type { QuadraticBezierCurve3, Vector3 } from "three";
import { HUBS } from "../data/hubs";
import { arcCurve, latLonToVector3 } from "../lib/geo";
import type { Shipment } from "../types/shipment.types";

const ROUTE_HEIGHT = 1.015;

export type Route = {
  shipment: Shipment;
  curve: QuadraticBezierCurve3; // the maths curve (packets ask it "where am I at 42%?")
  points: Vector3[];            // sampled points (for drawing the line)
};

export function buildRoutes(shipments: Shipment[]): Route[] {
  return shipments
    .filter((shipment) => shipment.status !== "delivered")
    .flatMap((shipment) => {
      const from = HUBS.find((hub) => hub.code === shipment.from);
      const to = HUBS.find((hub) => hub.code === shipment.to);
      if (!from || !to) return [];
      const curve = arcCurve(
        latLonToVector3(from.lat, from.lon, ROUTE_HEIGHT),
        latLonToVector3(to.lat, to.lon, ROUTE_HEIGHT),
      );
      return [{ shipment, curve, points: curve.getPoints(64) }];
    });
}