import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Earth from "./Earth";

const GlobeScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 2, 3]} intensity={1.5} />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

export default GlobeScene;
