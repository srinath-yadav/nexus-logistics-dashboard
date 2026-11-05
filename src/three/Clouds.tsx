import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

const CLOUD_SPEED = 0.01; // radians per second (slow drift)

const Clouds = () => {
  // 1. Load the black-and-white cloud image.
  //    No colorSpace: it's used for transparency (data), not as a colour.
  const cloudMap = useTexture("/textures/earth-clouds.jpg");

  // 2. A handle to the three.js mesh, so we can rotate it directly
  const ref = useRef<Mesh>(null);

  // 3. Runs every frame (~60x per second)
  useFrame((_, delta) => {
    if (!ref.current) return; // mesh not created yet
    ref.current.rotation.y += CLOUD_SPEED * delta; // same speed on any screen
  });

  // 4. A sphere just above the city-lights layer
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.01, 64, 64]} />
      <meshPhongMaterial
        color="white"
        alphaMap={cloudMap} // white = cloud, black = see-through
        transparent
        depthWrite={false} // don't hide the Earth or markers behind clouds
      />
    </mesh>
  );
};

export default Clouds;
