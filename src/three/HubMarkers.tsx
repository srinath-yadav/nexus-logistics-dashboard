import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, type Mesh, type MeshBasicMaterial } from "three";
import { HUBS } from "../data/hubs";
import { latLonToVector3 } from "../lib/geo";
import type { Hub } from "../types/hub.types";

const PULSE_SECONDS = 2; // one ping every 2 s

const HubMarker = ({ hub, index }: { hub: Hub; index: number }) => {
  const ringRef = useRef<Mesh>(null);

  // Position just above the clouds (1.01), calculated once per hub
  const position = useMemo(
    () => latLonToVector3(hub.lat, hub.lon, 1.015),
    [hub],
  );

  // Different start time per hub, so they don't all blink together
  const offset = index * 0.37;

  useFrame(({ clock }) => {
    const ring = ringRef.current;
    if (!ring) return;
    // t goes 0 → 1, then jumps back to 0 (repeats every PULSE_SECONDS)
    const t = ((clock.elapsedTime + offset) / PULSE_SECONDS) % 1;
    ring.scale.setScalar(1 + t * 2.5); // grow outward
    (ring.material as MeshBasicMaterial).opacity = 1 * (1 - t); // fade out
  });

  return (
    // lookAt(0,0,0) turns the group to face the Earth's centre → lies flat on the surface
    <group position={position} onUpdate={(group) => group.lookAt(0, 0, 0)}>
      {/* the dot */}
      <mesh>
        <circleGeometry args={[0.012, 24]} />
        <meshBasicMaterial color="#e6edf7" side={DoubleSide} />
      </mesh>
      {/* the pulsing ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.016, 0.024, 32]} />
        <meshBasicMaterial
          color="#4fd1ff"
          side={DoubleSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const HubMarkers = () => (
  <>
    {HUBS.map((hub, index) => (
      <HubMarker key={hub.code} hub={hub} index={index} />
    ))}
  </>
);

export default HubMarkers;
