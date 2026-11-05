import { useTexture } from "@react-three/drei";
import { MathUtils, SRGBColorSpace } from "three";

const Earth = () => {
  const textures = useTexture({
    map: "/textures/earth-day.jpg",
    normalMap: "/textures/earth-normal.png",
    specularMap: "/textures/earth-specular.jpg",
  });
  textures.map.colorSpace = SRGBColorSpace; // only the colour image

  return (
    <group rotation={[0, 0, MathUtils.degToRad(23.4)]}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />

        <meshPhongMaterial
          {...textures}
          specular="#333333"
          shininess={15}
          normalScale={[1.5, 1.5]}
        />
      </mesh>
    </group>
  );
};

export default Earth;
