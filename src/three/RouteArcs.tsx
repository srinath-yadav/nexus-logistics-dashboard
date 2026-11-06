import { Line } from "@react-three/drei";
import { STATUS_COLORS } from "../lib/status";
import type { Route } from "./routeData";

const RouteArcs = ({ routes }: { routes: Route[] }) => (
  <>
    {routes.map(({ shipment, points }) => (
      <Line
        key={shipment.id}
        points={points}
        color={STATUS_COLORS[shipment.status]}
        lineWidth={shipment.status === "exception" ? 3 : 2}
        transparent
        opacity={0.85}
        dashed={shipment.status === "delayed"}
        dashSize={0.04}
        gapSize={0.03}
      />
    ))}
  </>
);

export default RouteArcs;
