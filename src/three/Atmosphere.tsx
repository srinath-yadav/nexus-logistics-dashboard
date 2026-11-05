import { useMemo } from "react";
import { AdditiveBlending, BackSide, Color } from "three";
import { atmosphereFragment, atmosphereVertex } from "./atmosphereShader";

const Atmosphere = () => {
  // Values sent to the shader. No texture, so it's built once ([] = never rebuild).
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color("#4fa8ff") }, // glow colour
      uStrength: { value: 1.6 }, // glow brightness
    }),
    [],
  );

  return (
    // Slightly bigger than the Earth (1.0) and the clouds (1.01)
    <mesh>
      <sphereGeometry args={[1.15, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertex}
        fragmentShader={atmosphereFragment}
        uniforms={uniforms}
        side={BackSide} // draw the inside wall → only a ring around the Earth shows
        blending={AdditiveBlending} // glow adds light on top of the dark background
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

export default Atmosphere;
