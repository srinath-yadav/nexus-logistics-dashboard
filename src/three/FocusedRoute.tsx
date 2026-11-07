import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh, MeshBasicMaterial } from "three";
import { STATUS_COLORS } from "../lib/status";
import type { Route } from "./routeData";

const TRAVELLED_SAMPLES = 32;

const FocusedRoute = ({ route }: { route: Route }) => {
  const { curve, points, shipment } = route;
  const color = STATUS_COLORS[shipment.status];
  const haloRef = useRef<Mesh>(null);

  // Points from the start up to the current progress (the "done" part of the journey)
  const travelled = useMemo(
    () =>
      Array.from({ length: TRAVELLED_SAMPLES + 1 }, (_, i) =>
        curve.getPoint((shipment.progress * i) / TRAVELLED_SAMPLES),
      ),
    [curve, shipment.progress],
  );

  // Where the shipment is right now
  const position = useMemo(
    () => curve.getPoint(shipment.progress),
    [curve, shipment.progress],
  );

  // Pulsing halo around the shipment
  useFrame(({ clock }) => {
    const halo = haloRef.current;
    if (!halo) return;
    const t = (clock.elapsedTime / 1.4) % 1;
    halo.scale.setScalar(1 + t * 3);
    (halo.material as MeshBasicMaterial).opacity = 0.6 * (1 - t);
  });

  return (
    <>
      {/* Whole route: faint and dashed = still to travel */}
      <Line
        points={points}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.35}
        dashed
        dashSize={0.03}
        gapSize={0.02}
      />

      {/* Travelled part: bright and thick */}
      {shipment.progress > 0 && (
        <Line points={travelled} color={color} lineWidth={3} />
      )}

      {/* The shipment + its halo */}
      <mesh position={position}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={haloRef} position={position}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

export default FocusedRoute;
