import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Earth from "./Earth";
import { latLonToVector3 } from "../lib/geo";
import CityLights from "./CityLights";
import { SUN_DIRECTION } from "./constants";
import Clouds from "./Clouds";
import Atmosphere from "./Atmosphere";

const GlobeScene = () => {
  return (
    <Canvas
      camera={{ position: latLonToVector3(18, 80, 3).toArray(), fov: 45 }}
      dpr={[1, 2]}>
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
        <mesh position={latLonToVector3(13.08, 80.27, 1.02)}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </Suspense>
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

export default GlobeScene;
