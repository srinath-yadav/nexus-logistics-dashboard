import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const GlobeScene = () => {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 2, 3]} intensity={1.5} />
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="gray" />
        </mesh>
        <OrbitControls enablePan={false} autoRotate />
      </Canvas>
    </>
  );
};

export default GlobeScene;
