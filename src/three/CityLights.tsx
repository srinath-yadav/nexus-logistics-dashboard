import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { AdditiveBlending, SRGBColorSpace } from "three";
import { cityLightsVertex, cityLightsFragment } from "./cityLightsShader";
import { SUN_DIRECTION } from "./constants";

const CityLights = () => {
  const nightMap = useTexture("/textures/earth-night.jpg");
  nightMap.colorSpace = SRGBColorSpace;

  const uniforms = useMemo(
    () => ({
      uNightMap: { value: nightMap },
      uSunDirection: { value: SUN_DIRECTION },
    }),
    [nightMap],
  );

  return (
    <mesh>
      <sphereGeometry args={[1.002, 64, 64]} />
      <shaderMaterial
        vertexShader={cityLightsVertex}
        fragmentShader={cityLightsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

export default CityLights;
