import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import Earth from "./Earth";
import { latLonToVector3 } from "../lib/geo";
import CityLights from "./CityLights";
import { SUN_DIRECTION } from "./constants";
import Clouds from "./Clouds";
import Atmosphere from "./Atmosphere";
import HubMarkers from "./HubMarkers";
import RouteArcs from "./RouteArcs";
import { SHIPMENTS } from "../data/shipments";
import { buildRoutes } from "./routeData";
import Packets from "./Packets";

const GlobeScene = () => {
  const routes = useMemo(() => buildRoutes(SHIPMENTS), []);
  return (
    <Canvas
      camera={{ position: latLonToVector3(18, 80, 3).toArray(), fov: 45 }}
      dpr={[1, 2]}>
      <color attach="background" args={["#060a12"]} />
      <ambientLight intensity={0.05} />
      <directionalLight
        position={SUN_DIRECTION.clone().multiplyScalar(5)}
        intensity={2.5}
      />
      <Suspense fallback={null}>
        <Earth />
        <CityLights />
        <Clouds />
        <Atmosphere />
        <HubMarkers />
        <RouteArcs routes={routes} />
        <Packets routes={routes} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.15}
        minDistance={1.6}
        maxDistance={6}
      />
    </Canvas>
  );
};

export default GlobeScene;
