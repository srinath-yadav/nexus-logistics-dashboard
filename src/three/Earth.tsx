import { useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";

const Earth = () => {
  const dayMap = useTexture("/textures/earth-day.jpg");
  dayMap.colorSpace = SRGBColorSpace;

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={dayMap} />
    </mesh>
  );
};

export default Earth;
