import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { AdditiveBlending, SRGBColorSpace, Vector3 } from "three";
import { cityLightsVertex, cityLightsFragment } from "./cityLightsShader";
import { SUN_DIRECTION } from "./constants";

type Props = { sunDirection?: Vector3 };

const CityLights = ({ sunDirection = SUN_DIRECTION }: Props) => {
  const nightMap = useTexture("/textures/earth-night.jpg");
  nightMap.colorSpace = SRGBColorSpace;

  const uniforms = useMemo(
    () => ({
      uNightMap: { value: nightMap },
      uSunDirection: { value: sunDirection },
    }),
    [nightMap, sunDirection],
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
