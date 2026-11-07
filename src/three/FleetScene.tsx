import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import HubTowers from "./HubTowers";

const FleetScene = () => (
  <Canvas camera={{ position: [0, 3.5, 9], fov: 40 }} dpr={[1, 2]}>
    <color attach="background" args={["#060a12"]} />
    <ambientLight intensity={0.4} />
    <directionalLight position={[4, 8, 5]} intensity={1.6} />
    {/* floor grid: size, divisions, centre-line colour, grid colour */}
    <gridHelper args={[16, 16, "#2a3a58", "#1a2436"]} />
    <HubTowers />
    <OrbitControls
      enablePan={false}
      target={[0, 1.2, 0]} // orbit around the middle of the towers, not the floor
      minDistance={5}
      maxDistance={14}
      maxPolarAngle={Math.PI / 2.15} // stop the camera going under the floor
    />
  </Canvas>
);

export default FleetScene;
