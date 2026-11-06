import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { Vector3 } from "three";
import { HUBS } from "../data/hubs";
import { SHIPMENTS } from "../data/shipments";
import { arcCurve, latLonToVector3 } from "../lib/geo";
import { STATUS_COLORS } from "../lib/status";
import type { Shipment } from "../types/shipment.types";

const ROUTE_HEIGHT = 1.015; // same height as the hub markers

type Route = {
  shipment: Shipment;
  points: Vector3[]; // the curve, sampled into points for drawing
};

const RouteArcs = () => {
  // Build every route once (the data doesn't change yet)
  const routes = useMemo<Route[]>(
    () =>
      SHIPMENTS
        // finished shipments don't need a route drawn
        .filter((shipment) => shipment.status !== "delivered")
        // flatMap lets us return [] to skip a shipment, or [route] to keep it
        .flatMap((shipment) => {
          const from = HUBS.find((hub) => hub.code === shipment.from);
          const to = HUBS.find((hub) => hub.code === shipment.to);
          if (!from || !to) return []; // unknown hub code → skip instead of crashing

          const start = latLonToVector3(from.lat, from.lon, ROUTE_HEIGHT);
          const end = latLonToVector3(to.lat, to.lon, ROUTE_HEIGHT);
          const curve = arcCurve(start, end);

          return [{ shipment, points: curve.getPoints(64) }];
        }),
    [],
  );

  return (
    <>
      {routes.map(({ shipment, points }) => (
        <Line
          key={shipment.id}
          points={points}
          color={STATUS_COLORS[shipment.status]}
          lineWidth={4.5}
          transparent
          opacity={0.85}
          dashed={shipment.status === "delayed"} // delayed = dashed amber
          dashSize={0.04}
          gapSize={0.03}
        />
      ))}
    </>
  );
};

export default RouteArcs;
