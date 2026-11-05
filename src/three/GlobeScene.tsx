import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Earth from "./Earth";
import { latLonToVector3 } from "../lib/geo";

const GlobeScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 2, 3]} intensity={1.5} />
      <Suspense fallback={null}>
        <Earth />
        <mesh position={latLonToVector3(13.08, 80.27, 1.01)}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </Suspense>
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

export default GlobeScene;
