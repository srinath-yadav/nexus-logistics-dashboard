import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Vector3 } from "three";
import type { Shipment } from "../types/shipment.types";
import Atmosphere from "./Atmosphere";
import CityLights from "./CityLights";
import Earth from "./Earth";
import FocusedRoute from "./FocusedRoute";
import HubMarkers from "./HubMarkers";
import Loader from "./Loader";
import { buildRoute } from "./routeData";

const UP = new Vector3(0, 1, 0);

const RouteFocusScene = ({ shipment }: { shipment: Shipment }) => {
  const route = useMemo(() => buildRoute(shipment), [shipment]);

  // Camera + sun placement, based on where this route is on the globe
  const view = useMemo(() => {
    if (!route) return null;
    const { v0: start, v1: control, v2: end } = route.curve; // a Bézier curve's 3 points
    const centre = control.clone().normalize(); // direction of the route's middle
    const span = start.distanceTo(end); // 0 (short) … 2 (opposite sides)
    return {
      camera: centre.clone().multiplyScalar(1.9 + span * 0.9), // further back for longer routes
      // Sun a little to the side of the camera: route in daylight, with some shading
      sun: centre.clone().applyAxisAngle(UP, 0.6).normalize(),
    };
  }, [route]);

  if (!route || !view) return null;

  return (
    <Canvas camera={{ position: view.camera.toArray(), fov: 40 }} dpr={[1, 2]}>
      <color attach="background" args={["#060a12"]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={view.sun.clone().multiplyScalar(5)}
        intensity={2.2}
      />
      <Suspense fallback={<Loader />}>
        <Earth />
        <CityLights sunDirection={view.sun} />
        <Atmosphere />
        <HubMarkers />
        <FocusedRoute route={route} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={1.4} maxDistance={5} />
    </Canvas>
  );
};

export default RouteFocusScene;
