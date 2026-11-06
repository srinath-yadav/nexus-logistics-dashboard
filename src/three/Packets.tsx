import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type InstancedMesh } from "three";
import { STATUS_COLORS } from "../lib/status";
import type { Route } from "./routeData";

const Packets = ({ routes }: { routes: Route[] }) => {
  const meshRef = useRef<InstancedMesh>(null);

  // Each packet's progress along its route (0 → 1). A ref, NOT state:
  // it changes 60x per second and must never trigger a React re-render.
  const progress = useRef(routes.map((route) => route.shipment.progress));

  // Invisible helper used to build each instance's position matrix
  const dummy = useMemo(() => new Object3D(), []);

  // Colour each packet by status — once, before the first frame is drawn
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const color = new Color();
    routes.forEach((route, i) => {
      mesh.setColorAt(i, color.set(STATUS_COLORS[route.shipment.status]));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [routes]);

  // Move every packet, every frame
  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    routes.forEach((route, i) => {
      const { status, speed } = route.shipment;

      // Exceptions are stuck; everything else advances (and loops, for the demo)
      if (status !== "exception") {
        progress.current[i] = (progress.current[i] + speed * delta) % 1;
      }

      // Ask the curve: "where is the point at this % of the way?"
      dummy.position.copy(route.curve.getPoint(progress.current[i]));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true; // tell the GPU the positions changed
  });

  return (
    // args = [geometry, material, count]; undefined = use the children below
    <instancedMesh ref={meshRef} args={[undefined, undefined, routes.length]}>
      <sphereGeometry args={[0.018, 16, 16]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

export default Packets;
